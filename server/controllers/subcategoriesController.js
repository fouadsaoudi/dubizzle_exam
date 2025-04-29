const knex = require('../knex');
const { validationResult } = require('express-validator');

exports.getSubCategories = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const queryBuilder = knex('sub_categories')
            .select('*');

        const subCategories = await queryBuilder.orderBy('created_at', 'desc');

        res.json({ subCategories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching ads.' });
    }
};