const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    ingreso: {
        type: Number,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: false
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Transaction', transactionSchema)