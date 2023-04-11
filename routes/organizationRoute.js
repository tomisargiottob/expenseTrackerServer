import express from 'express';
import TransactionController from '../controllers/transactions'
import OrganizationController from '../controllers/organizations';
import CategoriesController from '../controllers/categories';
import AccountsController from '../controllers/accounts';
import AccountTypesController from '../controllers/accountTypes';
import AFIPController from '../controllers/invoicer/AFIPController';
import CuitController from '../controllers/invoicer/cuit';
import getUser from '../middlewares/authMiddleware';
import InvoiceController from '../controllers/invoicer/invoices';
import BalanceController from '../controllers/invoicer/balance';

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

// Invoicer
router.post('/organizations/:organizationId/cuits',getUser, CuitController.addCuit)
router.get('/organizations/:organizationId/cuits',getUser, CuitController.getAllCuits)

router.get('/organizations/:organizationId/cuits/:id',getUser, CuitController.getCuit)
router.get('/organizations/:organizationId/cuits/:id/login',getUser, AFIPController.getCMSToken)

router.post('/organizations/:organizationId/cuits/:id/invoices',getUser, InvoiceController.createInvoice)
router.get('/organizations/:organizationId/cuits/:id/invoices',getUser, InvoiceController.getInvoices)

router.get('/organizations/:organizationId/cuits/:id/balances',getUser, BalanceController.getAllBalances)
router.post('/organizations/:organizationId/cuits/:id/balances',getUser, BalanceController.batchBalanceCreate)


router.post('/organizations/:organizationId/cuits/:id/batchInvoice',getUser, InvoiceController.createBatchInvoice)
router.get('/organizations/:organizationId/cuits/:id/invoiceNumber',getUser, AFIPController.getNextInvoiceNumber)




export default router;
