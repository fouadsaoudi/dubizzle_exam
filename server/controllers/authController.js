const knex = require('../knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const userExists = await knex('users').where({ username }).first();
        if (userExists) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await knex('users').insert({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await knex('users')
            .select('users.id', 'users.username', 'users.password', 'roles.name as role')
            .join('roles', 'users.role_id', 'roles.id')
            .where('users.username', username)
            .first();

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Remove password from user object before sending it in response
        const { password: _, ...userWithoutPassword } = user;

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1w' }
        );

        res.json({ message: 'Logged in successfully.', token, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getCurrentUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await knex('users')
            .select('id', 'username')
            .where({ id: decoded.id })
            .first();

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ user });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};
