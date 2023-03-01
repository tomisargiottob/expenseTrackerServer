const express = require("express");
const TransactionController = require("../controllers/transactions");
const router = express.Router();

router.post("/oranizations/:organizationId/transactions", TransactionController.createTransaction);

router.patch("/oranizations/:organizationId/transactions/:id", TransactionController.updateTransaction);

router.delete("/oranizations/:organizationId/transactions/:id", TransactionController.removeTransaction);

router.get("/oranizations/:organizationId/transactions/", TransactionController.getTransactions );

module.exports = router;
