const knex = require('../knex');
const { validationResult } = require('express-validator');

// Fetch all visible (approved + active) ads
exports.getAllAds = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const queryBuilder = knex('ads')
            .join('sub_categories', 'ads.sub_category_id', 'sub_categories.id')
            .join('categories', 'sub_categories.category_id', 'categories.id')
            .select(
                'ads.id',
                'ads.title',
                'ads.description',
                'ads.location',
                'ads.price',
                'ads.status',
                'ads.created_at',
                'sub_categories.name as sub_category_name',
                'categories.name as category_name'
            )
            .where('ads.status', 'approved')
            .andWhere('ads.is_active', true);

        // ✅ Dynamic filters
        if (req.query.search) {
            queryBuilder.andWhere('ads.title', 'like', `%${req.query.search}%`);
        }
        if (req.query.min_price) {
            queryBuilder.andWhere('ads.price', '>=', req.query.min_price);
        }
        if (req.query.max_price) {
            queryBuilder.andWhere('ads.price', '<=', req.query.max_price);
        }
        if (req.query.location) {
            queryBuilder.andWhere('ads.location', 'like', `%${req.query.location}%`);
        }
        if (req.query.sub_category_id) {
            queryBuilder.andWhere('ads.sub_category_id', req.query.sub_category_id);
        }

        const ads = await queryBuilder.orderBy('ads.created_at', 'desc');

        res.json({ ads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching ads.' });
    }
};

// Fetch single visible ad
exports.getAdById = async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const ad = await knex('ads')
            .join('sub_categories', 'ads.sub_category_id', 'sub_categories.id')
            .join('categories', 'sub_categories.category_id', 'categories.id')
            .select(
                'ads.id',
                'ads.title',
                'ads.description',
                'ads.location',
                'ads.sub_category_id',
                'ads.price',
                'ads.status',
                'ads.created_at',
                'sub_categories.name as sub_category_name',
                'categories.name as category_name'
            )
            .where('ads.id', id)
            .andWhere('ads.status', 'approved')
            .andWhere('ads.is_active', true)
            .first();

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found.' });
        }

        res.json({ ad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching ad.' });
    }
};

// Fetch my ads (all versions)
exports.getMyAds = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;

        const myAds = await knex('ads')
            .leftJoin('ads as child', 'ads.id', 'child.parent_ad_id') // left join to detect edits
            .join('sub_categories', 'ads.sub_category_id', 'sub_categories.id')
            .join('categories', 'sub_categories.category_id', 'categories.id')
            .select(
                'ads.id',
                'ads.title',
                'ads.description',
                'ads.location',
                'ads.price',
                'ads.status',
                'ads.rejection_reason',
                'ads.created_at',
                'ads.sub_category_id',
                'sub_categories.name as sub_category_name',
                'categories.name as category_name',
                'ads.parent_ad_id',
                'ads.is_active'
            )
            .where('ads.user_id', userId)
            .andWhere(function (qb) {
                qb.whereIn('ads.status', ['pending', 'rejected'])
                    .orWhere(function (subQuery) {
                        subQuery.where('ads.status', 'approved');
                        subQuery.andWhere('child.id', null); // show approved ads only if no edit pending
                    });
            })
            .orderBy('ads.created_at', 'desc');

        res.json({ ads: myAds });
    } catch (error) {
        console.error('Error fetching your ads:', error);
        res.status(500).json({ message: 'Server error fetching your ads.' });
    }
};

// Create Ad (new)
exports.createAd = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, price, sub_category_id } = req.body;

    try {
        const userId = req.user.id;

        const [newAdId] = await knex('ads').insert({
            title,
            description,
            location,
            price,
            sub_category_id,
            user_id: userId,
            status: 'pending',
            is_active: false,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });

        res.status(201).json({ message: 'Ad created successfully. Pending moderation.', ad_id: newAdId });
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ message: 'Server error creating ad.' });
    }
};

// Update Ad (create new pending version)
exports.updateAdById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, location, price, sub_category_id } = req.body;

    try {
        const existingAd = await knex('ads').where({ id }).first();

        if (!existingAd) {
            return res.status(404).json({ message: 'Original ad not found.' });
        }

        // Create new pending version linked to original
        const [newAdId] = await knex('ads').insert({
            title,
            description,
            location,
            price,
            sub_category_id,
            user_id: existingAd.user_id,
            parent_ad_id: existingAd.id,
            status: 'pending',
            is_active: false,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now(),
        });

        res.json({ message: 'Ad edit submitted for moderation.', ad_id: newAdId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error submitting ad edit.' });
    }
};
