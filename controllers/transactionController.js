const transactionSchema = require('../models/transaction')
const userSchema = require('../models/user')

exports.transactionStore = (req,res) => {
    const transaction = transactionSchema(req.body)

    transaction.save().then(data => {
        userSchema.findById(req.body.user).then(resp => {
            let saldo = req.body.ingreso == 1 ? resp.saldo+req.body.valor : resp.saldo-req.body.valor
            userSchema.updateOne({ _id: req.body.user }, { $set: { saldo }}).then(response => {
                res.json(data)
            })
        })
    }).catch(error => {
        res.status(422)
        res.json({ message: 'error' })
    })
}