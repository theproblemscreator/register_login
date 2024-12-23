const jwt = require('jsonwebtoken');
const user = require('../models/user');

const checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1];
            const { userId } = jwt.verify(token, process.env.JWT_SECRET);            

            req.user = await user.findByPk(userId);

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized user', error: error.message });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized user, No Token' });
    }
};

module.exports = checkUserAuth;
