const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');

const blacklist = new Set();

const registerUser = async (req, res) => {
    const { name, email, password, confirm_password, mobile, term_and_condition } = req.body;

    if (!name || !email || !password || !mobile || term_and_condition || confirm_password) {
        if (password === confirm_password) {


            try {

                const existingUser = await User.findOne({
                    where: {
                        [Op.or]: [{ email }, { mobile }],
                    },
                })


                if (existingUser) {
                    return res.status(400).json({ message: 'User is Allready Registered...' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                // Saving the User to DB
                const newUser = await User.create({
                    name,
                    email,
                    mobile,
                    password: hashedPassword,
                    term_and_condition
                });

                const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '5d' });


                res.status(201).json({ message: 'User is Registered Successfully.....', user: { id: newUser.id, name: newUser.email, mobile: newUser.mobile, token: token } });

            }

            catch (error) {
                return res.status(500).json({ message: 'Someting Went Wrong' })
            }
      
        }
            else {
                return res.status(400).json({ message: 'Password and confirm password not match' });
    
            }
            return res.status(400).json({ message: 'All fields are required' });
        }

    }

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        //finding the user in db
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Email not found in records.' })
        }

        //compare the password to db password
        const password_match = await bcrypt.compare(password, user.password);

        if (!password_match) {

            return res.status(400).json({ message: 'Invalid Email And Password ' });
        }


        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '5d' });

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

const changePassword = async (req, res) => {
    const { } = req.body;

}

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User is not found' });
        }
        res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: 'Internal Sever Error ' });
    }

}

const logoutUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token

    if (!token) {

        res.status(400).json({ message: ' Token Not Provided ' });

        try {
            blacklist.add(token);
            console.log('logout successful..')
            return res.status(200).json({ message: ' Logout Successfully' });

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error.' });
        }
    }

}

const isTokenBlacklisted = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (blacklist.has(token)) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    next();
};


module.exports = { registerUser, loginUser, getUserById, logoutUser, isTokenBlacklisted };