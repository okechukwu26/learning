const Router = require('express').Router();
const User = require('../schema/user');
const auth = require('../utills/auth');
const { isEmpty } = require('../utills/validator');
const validator = require('validator');

Router.post('/signup', async (req, res) => {
  try {
    let errors = [];
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      exam: req.body.exam,
      state: req.body.state,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    //check required field

    if (!user.firstName) {
      errors.push({ firstName: 'please fill all field' });
    }
    if (!user.lastName) {
      errors.push({ lastName: 'please fill all field' });
    }
    if (!user.phone) {
      errors.push({ phone: 'please fill all field' });
    }
    if (!user.exam) {
      errors.push({ exam: 'please fill all field' });
    }
    if (!user.state) {
      errors.push({ state: 'please fill all field' });
    }
    if (!user.email) {
      errors.push({ email: 'please fill all field' });
    }

    if (!user.password) {
      errors.push({ password: 'please fill all field' });
    }
    //password match
    if (user.password !== user.confirmPassword) {
      errors.push({ confirmPassword: 'passwords do not match' });
    }
    //check password length
    if (user.password.length < 6) {
      errors.push({ password: 'password should be atleast 6 characters' });
    }
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const newUser = new User(user);
    await newUser.save();
    const token = await newUser.generateAuthToken();

    res.status(201).send({ newUser, token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ email: 'already in use' });
    } else {
      return res.json(err);
    }
  }
});
Router.post('/login', async (req, res) => {
  try {
    let errors = [];
    const user = {
      email: req.body.email,
      password: req.body.password,
    };
    if (!user.email) {
      errors.push({ email: 'please fill all field' });
    }

    if (!user.password) {
      errors.push({ password: 'please fill all field' });
    }
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    const newUser = await User.findByCredentials(user.email, user.password);
    const token = await newUser.generateAuthToken();
    res.status(200).send({ newUser, token });
  } catch (error) {
    return res.status(400).json(error);
  }
});
Router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
