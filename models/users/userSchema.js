const mongoose = require(`mongoose`)

const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, `Email must be valid`],
        unique: true,
    },
    password: String,
    isAdmin: Boolean,
    carts: {
        item: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: `product`
            }
        ]
    }
})

const newPerson = new mongoose.model(`user`, registerSchema)

module.exports = newPerson

// {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: `product`
        // }

        // carts: {
        //     item: [{
        //         item: [
        //             {
        //                 type: mongoose.Schema.Types.ObjectId,
        //                 ref: `product`
        //             },
        //             quantity: 
        //                 {
        //                     totalItem: {
        //                         type: Number,
        //                         default: 1 
        //                     },
        //                 }
        //         ]
        //     }]
        // }