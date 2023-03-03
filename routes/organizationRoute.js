const express = require('express');
const TransactionController = require('../controllers/transactions')
const OrganizationController = require('../controllers/organizations');
const CategoriesController = require('../controllers/categories');
const AccountsController = require('../controllers/accounts');

const router = express.Router();

router.post('/organizations/:id/users', OrganizationController.addUser);


// Transactions
router.post("/organizations/:organizationId/transactions", TransactionController.createTransaction);
router.put("/organizations/:organizationId/transactions/:id", TransactionController.updateTransaction);
router.delete("/organizations/:organizationId/transactions/:id", TransactionController.removeTransaction);
router.get("/organizations/:organizationId/transactions/", TransactionController.getTransactions );

// Categories

router.post('/organizations/:organizationId/categories', CategoriesController.createCategory);
router.delete('/organizations/:organizationId/categories/:id', CategoriesController.removeCategory);
router.put('/organizations/:organizationId/categories/:id', CategoriesController.createCategory);
router.get('/organizations/:organizationId/categories', CategoriesController.getCategories);

// Accounts


router.post('/organizations/:organizationId/accounts', AccountsController.createAccount);
router.delete('/organizations/:organizationId/accounts/:id', AccountsController.createAccount);
router.put('/organizations/:organizationId/accounts/:id', AccountsController.createAccount);
router.get('/organizations/:organizationId/accounts', AccountsController.getAccounts);

module.exports = router;
