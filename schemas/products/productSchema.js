const mongoose = require(`mongoose`)

const productsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
})

const newProduct = new mongoose.model(`product`, productsSchema)

module.exports = newProduct
