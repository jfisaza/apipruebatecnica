const transactionSchema = require('../models/transaction')
const userSchema = require('../models/user')

// Obtener reporte de movimientos de un usuario
exports.getMovimientos = async (req, res) => {
    const { id } = req.params
    const movimientos = await transactionSchema.find({ user: id })
    res.json({ data: movimientos })
}

// Cargar saldo a un usuario
exports.cargarSaldo = async (req, res) => {

    // Se busca el usuario para obtener el saldo
    const user = await userSchema.findOne({ _id: req.body._id })
    let newSaldo = user.saldo+ parseInt(req.body.valor)

    // Se actualiza el saldo y se registra la transacción
    userSchema.updateOne({ _id: req.body._id }, { $set: { saldo: newSaldo }}).then(response => {

        const userTransaction = transactionSchema({ fecha: new Date, ingreso: 1, valor: req.body.valor, descripcion: 'Recarga de saldo', user: user._id })
        userTransaction.save()

        res.json({ message: 'Success', status: 200 })
    }).catch(error => {
        res.status(500)
        res.json({ message: 'error' })
    })
}

// Transferir dinero a otro usuario
exports.transferir = async (req, res) => {
    // Se consultan los usuarios
    const receptor = await userSchema.findOne({ telefono: req.body.telefono })
    const emisor = await userSchema.findOne({ _id: req.body._id })

    // Si no existe un usuario con el nro de telefono se devuelve un error
    if(!receptor || receptor.lenght == 0){
        res.status(422)
        res.json({ message: 'El usuario con el número de teléfono indicado no existe.', status: 422 })
        return
    }

    // Se calcula el saldo del emisor y si es menor a 0 se devuelve un error
    let saldo = emisor.saldo-parseInt(req.body.valor)

    if(saldo < 0){
        res.status(422)
        res.json({ message: 'No cuenta con saldo suficiente para realizar la transacción.', status: 422 })
        return
    }

    // Se actualiza el saldo del emisor
    await userSchema.updateOne({ _id: emisor._id }, { $set: { saldo }})

    const transaccionEmisor = transactionSchema({ fecha: new Date, ingreso: 0, valor: req.body.valor, descripcion: 'Transferencia al usuario '+receptor.nombre+' '+receptor.apellido, user: emisor._id })
    transaccionEmisor.save()
    // Se calcula el saldo del receptor y se actualiza
    saldo = receptor.saldo+parseInt(req.body.valor)
    await userSchema.updateOne({ _id: receptor._id }, { $set: { saldo }})

    const transaccionReceptor = transactionSchema({ fecha: new Date, ingreso: 1, valor: req.body.valor, descripcion: 'Transferencia del usuario '+emisor.nombre+' '+emisor.apellido, user: receptor._id })
    transaccionReceptor.save()

    res.json({ message: 'Success', status: 200 })
    
}

// Realizar pago
exports.realizarPago = async (req, res) => {
    // Se realizan validaciones para verificar que exista el usuario, que el pin sea correcto, que el pin no esté bloqueado y que tenga suficiente saldo
    const user = await userSchema.findOne({ telefono: req.body.telefono })
    if(!user || user.lenght == 0){
        res.status(422)
        res.json({ message: 'El número de teléfono no se encuentra registrado.', status: 422 })
        return
    }

    if(user.intentos == 3){
        res.status(422)
        res.json({ message: 'Su pin se encuentra bloqueado, por favor ingrese al portal web para restablecer el pin.', status: 422 })
        return
    }

    if(req.body.pin != user.pin){
        await userSchema.updateOne({ _id: emisor._id }, { $set: { intentos: user.intentos+1 }})
        res.status(422)
        res.json({ message: 'El pin es incorrecto', status: 422 })
        return
    }

    if(parseInt(req.body.valor) > user.saldo){
        res.status(422)
        res.json({ message: 'No tiene saldo suficiente.', status: 422 })
        return
    }

    let saldo = user.saldo - parseFloat(req.body.valor)
    userSchema.updateOne({ _id: emisor._id }, { $set: { saldo }}).then(response => {
        const transaccion = transactionSchema({ fecha: new Date, ingreso: 0, valor: req.body.valor, descripcion: req.body.descripcion, user: user._id })
        transaccion.save()

        res.json({ message: 'success', status: 200 })

    }).catch(error => {
        res.status(500)
        res.json({ message: 'error' })
    })
}