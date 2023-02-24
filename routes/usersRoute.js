const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Organization = require('../models/Organization');

const router = express.Router();

router.post('/login', async function (req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) throw new Error('Check your credentials');

    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error('Check your credentials');
    const organization = await Organization.findOne({_id: user.organization})
    res.send({user, organization});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', async function (req, res) {
  try {
    const {
      organization,
      name,
      email,
      password,
    } = req.body
    const existentUser = await User.findOne({email})
    if(existentUser) throw new Error('User already registered in an Organization')
    const newOrg = new Organization({name: organization});
    await newOrg.save();
    const user = new User({name, email, role: 'admin', organization: newOrg._id});
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await user.save();
    res.send('User Registered Successfully');
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
