const mongoose = require('mongoose');
const { default: validator } = require("validator");
// const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your email address'],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Custom validation to check if password and passwordConfirm match
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

const User = mongoose.model('User', UserSchema)

module.exports = User