const express = require(`express`)
const mongoose = require(`mongoose`)
const bcrypt = require(`bcrypt`) 
const router = express.Router()

const saltRounds = 10

const product = require(`../../schemas/products/productSchema`)
const user = require(`../../schemas/users/userSchema`)


router.get(`/signup`, (req, res) => {
    res.render(`register`)
})

router.post(`/signup`, (req, res) => {

    const { email, password} = req.body

    bcrypt.hash(password, saltRounds, function(err, hash) {

    const person = new user ({
        email,
        password: hash
    })

    user.findOne({email, password}, (err, existAcc) => {

        if (err) {
            console.log(err)
        } else if (existAcc) {
            if (existAcc.email === email) {
                console.log(existAcc)
                res.render(`userexists`)
            } 
        } else if (email === "" && password === "" ) {
            res.render(`fillup`)
        } else if (email && password === "") {
            res.render(`password`)
        } else if (email === "" && password ) {
            res.render(`email`)
        } else if (email && password) {
            person.save()
            const kuki = req.session.ID = person._id
            console.log(kuki)
            console.log(hash)
            res.redirect(`/home`)
        } 

    })
    })

})

module.exports = router