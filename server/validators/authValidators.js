const { body } = require("express-validator");

exports.getUserInfoValidation = [
    body("token")
        .notEmpty()
        .withMessage("Token is required.")
];


exports.registerValidation = [
    body("username")
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters."),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),
];

exports.loginValidation = [
    body("username")
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters."),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),
];
