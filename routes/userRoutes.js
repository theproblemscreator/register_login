const express = require('express');
const { registerUser, loginUser, logoutUser, changePassword } = require('../controllers/userController');
const checkUserAuth = require('../middlewares/auth-middleware');
const router = express.Router();

// Swagger documentation...
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/changepassword', checkUserAuth, changePassword);
router.post('/logout', logoutUser);

module.exports = router;
