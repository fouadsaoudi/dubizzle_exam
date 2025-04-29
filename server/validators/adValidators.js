const { query, param, body, validationResult } = require('express-validator');

exports.adsListValidation = [
    query('search')
        .optional()
        .isString()
        .trim()
        .withMessage('Search must be a valid string.'),

    query('min_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number.'),

    query('max_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number.'),

    query('location')
        .optional()
        .isString()
        .trim()
        .withMessage('Location must be a valid string.'),

    query('sub_category_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Sub-category ID must be a valid integer.'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page number must be a positive integer.'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100.')
];

// ✅ New validator for ad ID
exports.adIdValidation = [
    param('id')
        .exists()
        .withMessage('Ad ID is required.')
        .isInt({ min: 1 })
        .withMessage('Ad ID must be a valid positive integer.')
];

exports.createAdValidation = [
    body('title')
        .exists()
        .withMessage('Title is required.')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty.'),

    body('description')
        .exists()
        .withMessage('Description is required.')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Description cannot be empty.'),

    body('location')
        .optional()
        .isString()
        .trim()
        .withMessage('Location must be a valid string.'),

    body('price')
        .exists()
        .withMessage('Price is required.')
        .isFloat({ min: 0 })
        .withMessage('Price must be zero or greater. Negative prices are not allowed.'),

    body('sub_category_id')
        .exists()
        .withMessage('Sub-category ID is required.')
        .isInt({ min: 1 })
        .withMessage('Sub-category ID must be a valid positive integer.')
];

exports.validateAdStatusUpdate = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
    body('rejection_reason')
        .if(body('status').equals('rejected'))
        .notEmpty().withMessage('Rejection reason is required when status is rejected'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];