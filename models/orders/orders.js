const mongoose = require(`mongoose`)

const orderSchema = new mongoose.Schema({
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    orderedItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cartItem'
        }
    ]
})

const Order = new mongoose.model(`order`, orderSchema)

module.exports = Order