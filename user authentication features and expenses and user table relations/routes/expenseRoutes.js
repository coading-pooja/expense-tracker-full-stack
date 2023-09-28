const express = require('express');
const router = express.Router();
const authentication = require('../middleware/auth');

const expenseController = require('../controllers/expenseController.js');
router.post('/addexpense', authentication.authenticate, expenseController.addexpense); 
router.post('/deleteexpense', expenseController.deleteexpense);
router.get('/getexpenses',authentication.authenticate,  expenseController.getexpenses);

module.exports = router;                                                                                                