const express = require('express');

const CategoriesController = require('../controllers/categories');

const router = express.Router();

router.post('/organizations/:id/categories', CategoriesController.createCategory);

router.get('/organizations/:id/categories', CategoriesController.getCategories);


module.exports = router;
