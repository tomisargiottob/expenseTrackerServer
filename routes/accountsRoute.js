const express = require('express');

const AccountsController = require('../controllers/accounts');

const router = express.Router();

router.post('/organizations/:id/accounts', AccountsController.createAccount);

router.get('/organizations/:id/accounts', AccountsController.getAccounts);

module.exports = router;
