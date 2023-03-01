const express = require('express');
const bcrypt = require('bcryptjs')

const Organization = require('../models/Organization');
const User = require('../models/Organization');
const Category = require('../models/Category');
const Account = require('../models/Account');


const router = express.Router();

router.post('/:id/users', async function (req, res) {
  try {
    const {id} = req.params
    const organization = await Organization.findByPk(id)
    if(!organization) {
        res.status(404).json("Organization does not exist");
    }
    const {
        name,
        email,
        password,
        role,
    } = req.body
    const user = new User({name, email, role});
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await user.save();
    res.send('Organization user successfully added');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/:id/accounts', async function (req, res) {
  try {
    const {id} = req.params
    const organization = await Organization.findById(id)
    if(!organization) {
        res.status(404).json("Organization does not exist");
    }
    const {
      name,
      type
    } = req.body
    const existentAccount = await Account.find({name,type,organization: id})
    if(existentAccount.length) throw new Error('Account already exists in organization')
    const account = new Account({name, type, organization: id});
    await account.save();
    res.send('Organization Account successfully added');
  } catch (error) {
    console.log(error.message)
    res.status(500).json(error.message);
  }
});

router.get('/:id/accounts', async function (req, res) {
  try {
    const {id} = req.params
    const organization = await Organization.findById(id)
    if(!organization) {
      res.status(404).json("Organization does not exist");
    }
    const accounts = await Account.find({organization: id})
    res.send(accounts);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.post('/:id/categories', async function (req, res) {
  try {
    const {id} = req.params
    const organization = await Organization.findById(id)
    if(!organization) {
      res.status(404).json("Organization does not exist");
    }
    const {
      name,
    } = req.body
    const category = new Category({name, organization});
    await category.save();
    res.send('Organization category successfully added');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id/categories', async function (req, res) {
  try {
    const {id} = req.params
    const organization = await Organization.findById(id)
    if(!organization) {
      res.status(404).json("Organization does not exist");
    }
    const categories = await Category.find({organization: id})
    res.send(categories);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});


module.exports = router;
