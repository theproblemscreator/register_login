const express = require('express');
const { loginUser } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *           example: user@example.com
 *         password:
 *           type: string
 *           description: The password for the user
 *           example: password123
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Log in a user with email and password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error
 */


// Login Route
router.post('/login', loginUser);

module.exports = router;
