const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');

const blacklist = new Set(); 

const registerUser = async (req, res) => {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ message: 'All fields are required' });
    }

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
            password: hashedPassword
        });

        res.status(201).json({ message: 'User is Registered Successfully.....', user: { id: newUser.id, name: newUser.email, mobile: newUser.mobile } });

    } catch (error) {
        return res.status(500).json({ message: 'Someting Went Wrong' })
    }

}

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

        const password_match = await bcrypt.compare(password, user.password);

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

const getUserById = async(req,res)=>{
    const { id } = req.params;

    try {
        const user = await User.findOne({where : {id}});

        if(!user){
            return res.status(404).json({message : 'User is not found'});
        }
        res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({message : 'Internal Sever Error '});
    }

}

const logoutUser = async(req,res)=>{
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token

    if(!token){

        res.status(400).json({message : ' Token Not Provided '});
        
        try {
            blacklist.add(token);
            console.log('logout successful..')
            return res.status(200).json({message: ' Logout Successfully'});

        } catch (error) {
            return res.status(500).json({message  : 'Internal Server Error.'});
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

    
module.exports = { registerUser , loginUser , getUserById, logoutUser, isTokenBlacklisted};