const jwt = require('jsonwebtoken')

// Middleware para validar el token del usuario
exports.validateToken = async function(req,res,next){
	const accessToken = req.headers['authorization']
	if(!accessToken) {
		res.status(409)
		res.json({ message: 'Access denied.', status: 409 })
		return
	}

	await jwt.verify(accessToken,process.env.SECRET, (err) => {
		if(err){
			res.status(409)
			res.json({ message: 'Access denied.', status: 409 })
			return
		}else{
			next()
		}
	})
}