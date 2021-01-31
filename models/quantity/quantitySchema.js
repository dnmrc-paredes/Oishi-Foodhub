const mongoose = require(`mongoose`)

const quantitySchema = new mongoose.Schema ({
    qty: [

        {
            itemCount: {
                type: Number,
                default: 0
            }
        },

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `product`
        }
        
    ],
    cartOwner: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `user`
        }
    ],
    itemName: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `product`
        }
    ]
})