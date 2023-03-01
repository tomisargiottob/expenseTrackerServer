const express = require('express');

const OrganizationController = require('../controllers/organizations');

const router = express.Router();

router.post('/organizations/:id/users', OrganizationController.addUser);

module.exports = router;
