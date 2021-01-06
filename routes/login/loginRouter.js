const express = require(`express`)
const mongoose = require(`mongoose`)
const bcrypt = require(`bcrypt`)
const router = express.Router()

const product = require(`../../schemas/products/productSchema`)
const user = require(`../../schemas/users/userSchema`)

router.get(`/`, (req, res) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {
        res.redirect(`/home`)
    }

})

router.post(`/`, (req, res) => {

    const { email, password } = req.body

    if (email === "" && password === "") {
        res.render(`tryagain`)
    } else if (email && password === "") {
        res.render(`password`)
    } else if (email === "" && password) {
        res.render(`email`)
    }

    user.findOne({email}, (err, foundAcc) => {
        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc) {
                bcrypt.compare(password, foundAcc.password, function(err, result) {
                    if (result === true) {
                        const kuki = req.session.ID = foundAcc._id
                        res.redirect(`/home`)
                    } else if (result === false) {
                        res.render(`login`)
                    } else {
                        res.render(`login`)
                    }
                })
            }
        } else {
            res.render(`login`)
        }

    })

})

module.exports = router
