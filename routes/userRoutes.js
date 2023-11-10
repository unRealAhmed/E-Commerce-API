const express = require('express');

const router = express.Router();

const { signUp, login, logout, forgetPassword, resetPassword, updatePassword, protect } = require('../controllers/authController');

// Public routes
router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

module.exports = router;