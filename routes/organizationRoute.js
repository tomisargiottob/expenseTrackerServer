const express = require('express');
const TransactionController = require('../controllers/transactions')
const OrganizationController = require('../controllers/organizations');
const CategoriesController = require('../controllers/categories');
const AccountsController = require('../controllers/accounts');
const AccountTypesController = require('../controllers/accountTypes');


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
router.put('/organizations/:organizationId/categories/:id', CategoriesController.updateCategory);
router.get('/organizations/:organizationId/categories', CategoriesController.getCategories);

// Accounts

router.post('/organizations/:organizationId/accounts', AccountsController.createAccount);
router.delete('/organizations/:organizationId/accounts/:id', AccountsController.removeAccount);
router.put('/organizations/:organizationId/accounts/:id', AccountsController.updateAccount);
router.get('/organizations/:organizationId/accounts', AccountsController.getAccounts);

// accountTypes

router.post('/organizations/:organizationId/accountTypes', AccountTypesController.createAccountType);
router.delete('/organizations/:organizationId/accountTypes/:id', AccountTypesController.removeAccountType);
router.put('/organizations/:organizationId/accountTypes/:id', AccountTypesController.updateAccountType);
router.get('/organizations/:organizationId/accountTypes', AccountTypesController.getAccountTypes);

module.exports = router;
