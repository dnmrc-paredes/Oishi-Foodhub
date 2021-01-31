const mongoose = require(`mongoose`)

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Name must be provide.`],
        unique: true,
    },
    price: Number,
    description: String
})

const newProduct = new mongoose.model(`product`, productsSchema)

module.exports = newProduct
