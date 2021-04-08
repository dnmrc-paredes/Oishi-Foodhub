const mongoose = require(`mongoose`)

const cartItemSchema = new mongoose.Schema({
    itemName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    itemOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`
    },
    qty: Number,
    isCheckout: {
        type: Boolean,
        default: false
    }
})

const CartItem = new mongoose.model(`cartItem`, cartItemSchema)

module.exports = CartItem

