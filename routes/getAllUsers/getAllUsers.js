const express = require('express')
const mongoose = require(`mongoose`)
const router = express.Router()
const createError = require('http-errors')

// Models
const User = require(`../../models/users/userSchema`)

router.get('/getallusers', async (req, res, next) => {

    const allUsers = await User.find({}).populate('carts').populate({
        path: 'carts',
        populate: 'itemName',
    })

    res.send(allUsers)

})

module.exports = router