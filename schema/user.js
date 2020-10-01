const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      Required: true,
    },
    lastName: {
      type: String,
      Required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('This is not a valid email');
        }
      },
    },
    phone: {
      type: Number,
      required: true,
      minlength: 11,
    },
    exam: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('password must not contain "password"');
        }
      },
    },
    confirmPassword: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// send back jus the user profile details
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.confirmPassword;

  return userObject;
};
// //authenticate the user before runing any route
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    'afrilearning',
    { expiresIn: '1 day' }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// // find the credentials of the user for login
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('invalid credential');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('invalid credential');
  }
  return user;
};
// //security for password
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
