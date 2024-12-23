const express = require('express');
const { registerUser, loginUser, changePassword } = require('../controllers/userController');
const checkUserAuth = require('../middlewares/auth-middleware');
const router = express.Router();

// Swagger documentation...
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changepassword', checkUserAuth, changePassword);

module.exports = router;
