const userSchema = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Registrar usuario
exports.userStore = (req, res) => {
    let data = req.body
    // Se genera el token
    let token = jwt.sign(data,process.env.SECRET,{ expiresIn: '15m' })
    // Se encripta la contraseña
    const salt = bcrypt.genSaltSync(saltRounds)
    data.contraseña = bcrypt.hashSync(req.body.contraseña, salt)

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
exports.login = (req,res) => {
    userSchema.find({'correo':req.body.usuario}).then(async data => {
        console.log(data)
        if(data.length == 0){
            res.status(422)
            res.json({ message: 'Usuario o contraseña incorrectos'})
        }
        let validateContraseña = await bcrypt.compare(req.body.contraseña, data.contraseña)
        if(!validateContraseña){
            res.status(422)
            res.json({ message: 'Usuario o contraseña incorrectos'})
        }
        let token = jwt.sign(data,process.env.SECRET,{ expiresIn: '15m' })
        res.json({ data: data, token: token })
    }).catch(error => {
        console.log(error)
        res.status(422)
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