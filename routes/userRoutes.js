const express = require('express');
const { registerUser } = require('../controllers/userController');
const {loginUser} = require('../controllers/authController')
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access protected route
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed protected route
 *       401:
 *         description: Token is missing or invalid
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - mobile
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password for the user
 *         mobile:
 *           type: string
 *           description: The mobile number of the user
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided data
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */


router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted',
    user: req.user, // Token payload
  });
});
  

router.post('/register', registerUser);
router.post('/login',loginUser);


module.exports = router;

