const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    identificacion: {
        type: String,
        required: false
    },
    nombre: {
        type: String,
        required: false
    },
    apellido: {
        type: String,
        required: false
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: Number,
        required: true,
        unique: true
    },
    pin: {
        type: Number,
        required: true
    },
    contraseña: {
        type: String,
        required: true
    },
    saldo: {
        type: Number,
        required: false,
        default: 0
    },
    token: {
        type: String,
        required: false,
        default: ""
    }
})

module.exports = mongoose.model('User', userSchema)