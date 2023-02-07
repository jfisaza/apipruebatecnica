var express = require('express');
require('dotenv').config();
var router = express.Router();

// Middlewares
const { validateToken } = require('../middlewares/authorization')

// Controllers
var userController = require('../controllers/userController');
var transactionController= require('../controllers/transactionController');

// Routes
router.post('/user',userController.userStore)
router.post('/login',userController.login)
router.get('/getUser', validateToken,userController.getUser)
router.post('/transaction',transactionController.transactionStore)


module.exports = router;
