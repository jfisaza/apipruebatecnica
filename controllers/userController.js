const userSchema = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Obtener usuario mediante el token
exports.getUser = async (req, res) => {
    // Se toma el token de los headers y se valida
    let token = req.headers.authorization
    const verifyToken = await jwt.verify(token,process.env.SECRET)
    if(!verifyToken){
        res.status(422)
        res.json({ message: 'Su sesión ha expirado.', status: 422 })
        return
    }

    // Se consulta el usuario con el token, si no encuentra retorna un error
    const user = await userSchema.findOne({ token: token })
    if(!user || user.length == 0){
        res.status(422)
        res.json({ message: 'Su sesión ha expirado.', status: 422 })
        return
    }

    res.json({ data: user })
}

// Registrar usuario
exports.userStore = async (req, res) => {
    let data = req.body
    // Se genera el token
    const token = await jwt.sign(data,process.env.SECRET,{ expiresIn: '15m' })
    // Se encripta la contraseña
    const salt = bcrypt.genSaltSync(saltRounds)
    data.contraseña = bcrypt.hashSync(req.body.contraseña, salt)
    data.token = token

    // Se guarda el usuario en la base de datos
    const user = userSchema(data)
    user.save().then((data) => {
        res.json({ user: data, token: token })
    }).catch((error) => {
        console.log(error)
        res.status(422)
        res.json({ message: 'error' })
    })
}

// Loguear usuario
exports.login = async (req,res) => {
    const user = await userSchema.findOne({'correo':req.body.usuario})
    if(!user || user.length == 0){
        res.status(422)
        res.json({ message: 'El usuario con el que intenta ingresar no se encuentra registrado en nuestar plataforma.', status: 422 })
        return
    }

    const validateContraseña = await bcrypt.compare(req.body.contraseña, user.contraseña)

    if(!validateContraseña){
        res.status(422)
        res.json({ message: 'Usuario o contraseña incorrectos.', status: 422 })
        return
    }

    const token = await jwt.sign(user.toJSON(),process.env.SECRET,{ expiresIn: '15m' })
    userSchema.updateOne({ _id: user._id },{ token: token }).then(resp => {
        res.json({ data: user, token: token })
    }).catch(error => {
        res.status(500)
        res.json({ message: 'error' })
    })

}

// Actualizar datos del usuario
exports.update = (req, res) => {
    const { _id } = req.params
    const { identificacion,nombre,apellido } = req.body
    userSchema.updateOne({ _id: _id }, { $set: { identificacion,nombre,apellido } }).then(data => {
        res.json(data)
    }).catch(error => {
        console.log(error)
        res.status(500)
        res.json({ message: 'error' })
    })
}