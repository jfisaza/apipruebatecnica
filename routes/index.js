var express = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config();
var router = express.Router();

var { userStore, login, update } = require('../controllers/userController');
var { transactionStore } = require('../controllers/transactionController');


router.post('/user',userStore)
router.post('/login',login)
router.put('/user/:id',update)
router.get('/generateToken',generateToken)
router.post('/transaction',transactionStore)

function generateToken(req,res){
	res.send(jwt.sign(req.body,process.env.SECRET,{ expiresIn: '15m' }))
}

function validateToken(req,res,next){
	const accessToken = req.headers['authorization']
	if(!accessToken) res.send('Access denied.')

	jwt.verify(accessToken,process.env.SECRET, (err) => {
		if(err){
			res.send('Access denied.')
		}else{
			next
		}
	})
}

module.exports = router;
