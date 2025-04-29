const { validationResult } = require('express-validator');
const knex = require('../knex');

// Fetch ads for moderation (latest version only)
exports.getAdminAds = async (req, res) => {
    try {
        const ads = await knex('ads')
            .leftJoin('ads as child', 'ads.id', 'child.parent_ad_id')
            .join('users', 'ads.user_id', 'users.id')
            .join('sub_categories', 'ads.sub_category_id', 'sub_categories.id')
            .select(
                'ads.id',
                'ads.title',
                'ads.status',
                'ads.rejection_reason',
                'ads.price',
                'ads.description',
                'ads.location',
                'ads.created_at',
                'ads.updated_at',
                'users.username as posted_by',
                'sub_categories.name as sub_category',
                'ads.parent_ad_id',
                'ads.is_active'
            )
            .where(function (qb) {
                qb.whereIn('ads.status', ['pending', 'rejected'])
                    .orWhere(function (subQuery) {
                        subQuery.where('ads.status', 'approved');
                        subQuery.andWhere('child.id', null);  // ✅ Corrected
                    });
            })
            .orderBy('ads.created_at', 'desc');

        res.json({ ads });
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({ message: 'Server error fetching ads' });
    }
};

// Update ad status (Approve or Reject pending versions)
exports.updateAdStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const ad = await knex('ads').where({ id }).first();

        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        if (status === 'approved') {
            // 🛠 If approving, deactivate old version if any
            if (ad.parent_ad_id) {
                // Deactivate previous version
                await knex('ads')
                    .where({ id: ad.parent_ad_id })
                    .update({ is_active: false });
            }

            // Activate this ad
            await knex('ads')
                .where({ id })
                .update({
                    status: 'approved',
                    rejection_reason: null,
                    is_active: true,
                    updated_at: knex.fn.now()
                });
        } else if (status === 'rejected') {
            // 🛠 If rejecting, just update status and keep it inactive
            await knex('ads')
                .where({ id })
                .update({
                    status: 'rejected',
                    rejection_reason,
                    is_active: false,
                    updated_at: knex.fn.now()
                });
        }

        res.json({ message: 'Ad status updated successfully.' });
    } catch (error) {
        console.error('Error updating ad status:', error);
        res.status(500).json({ message: 'Server error updating ad.' });
    }
};
