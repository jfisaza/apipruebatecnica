var express = require('express');
require('dotenv').config();
var router = express.Router();

// Middlewares
const { validateToken } = require('../middlewares/authorization')

// Controllers
var userController = require('../controllers/userController');
var transactionController= require('../controllers/transactionController');

// Routes
// Rutas de usuario
router.post('/user',userController.userStore)
router.post('/login',userController.login)
router.put('/actualizaUser/:id',validateToken,userController.update)
router.get('/getUser', validateToken,userController.getUser)
router.get('/recuperarPin/:id', validateToken,userController.recuperarPin)
// Rutas de transacciones
router.get('/getMovimientos/:id',validateToken,transactionController.getMovimientos)
router.post('/transferir',validateToken,transactionController.transferir)
router.post('/cargarSaldo',validateToken,transactionController.cargarSaldo)
router.post('/realizarPago',transactionController.realizarPago)


module.exports = router;
