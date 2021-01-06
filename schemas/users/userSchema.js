const mongoose = require(`mongoose`)

const registerSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean,
})

const newPerson = new mongoose.model(`user`, registerSchema)

module.exports = newPerson
