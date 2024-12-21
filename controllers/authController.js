const bcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Op } = require('sequelize');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status({ message: 'Invalid User Details.' })
        }

        const password_match = await bcypt.compare(password, user.password);

        if (!password_match) {

            return res.status(400).json({ message: 'Invalid Email And Password ' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiry time
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            email: user.email,
            mobile: user.mobile,
            name: user.name

        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports = { loginUser };