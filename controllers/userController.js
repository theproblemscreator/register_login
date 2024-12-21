const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Op } = require('sequelize');

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

const loginUser = async(req,res)=>{

}

module.exports = { registerUser ,loginUser};