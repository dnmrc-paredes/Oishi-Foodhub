const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)
const bcrypt = require(`bcrypt`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)

router.get(`/`, async (req, res ,next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {
        
        try {
            res.redirect(`/products`)
        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

router.post(`/`, async (req, res, next) => {

    const {email, password} = req.body

    try {

        let errorBox = []

        if (!email || !password) {
            errorBox.push({ msg: `Please input all required fields.`})
            return res.render(`login`, { errorBox, email, password })
        }

        User.findOne({email}, async (err, foundUser) => {

            if (err) {
                console.log(err)
            } else if (foundUser) {
            
            bcrypt.compare(password, foundUser.password, async (err, result) => {
                if (result) {
                    const token = await jwt.sign({active: foundUser._id}, process.env.JWT_KEY)
                    req.session.ID = token
                    res.redirect(`/products`)
                } else {
                    errorBox.push({ msg: `Invalid Email or Password` })
                    return res.render(`login`, { errorBox, email, password })
                }
            })

            } else {
                errorBox.push({ msg: `Invalid Email or Password` })
                return res.render(`login`, { errorBox, email, password })
            }

        })

    } catch (err) {
        errorBox.push({ msg: `Invalid Email or Password` })
        return res.render(`login`, { errorBox, email, password })
    }

})

module.exports = router