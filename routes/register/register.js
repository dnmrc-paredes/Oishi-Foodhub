const express = require(`express`)
const createError = require(`http-errors`)
const {body , validationResult} = require(`express-validator`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)

const saltRounds = 10

const router = express.Router()

const User = require(`../../models/users/userSchema`)

router.get(`/register`, async (req, res, next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`register`)
    } else {
        
        try {     
            res.redirect(`/products`) 
        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

router.post(`/register`,body('email').isEmail().withMessage(`Email must be valid.`),body('password').isLength({ min: 4 }).withMessage(`Password must be 4 characters long`), async (req, res, next) => {

    const {email, password} = req.body

    let errorBox = []

    try {

        if (!email, !password) {
            errorBox.push({ msg: `Please input all required fields.`})
            return res.render(`register`, { errorBox, email, password })
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errorBox.push({ msg: errors.errors[0].msg })
            return res.render(`register`, { errorBox, email, password })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new User ({
            email,
            password: hashedPassword
        })

        if (!newUser) {
            return next(createError(err.status, err))
        }

        await newUser.save()
        const token = await jwt.sign({active: newUser._id}, process.env.JWT_KEY)
        req.session.ID = token
        res.redirect(`/products`)
        
    } catch (err) {

        if (err.code === 11000 || err.keyPattern.email === 1) {
            errorBox.push({ msg: `Email already in use`})
            return res.render(`register`, { errorBox, email, password })
        }

        next(createError(err.status, err))
    }

})

module.exports = router