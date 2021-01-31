const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)

router.get(`/adminpanel`, async (req, res, next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {

            const decoded = await jwt.verify(kuki, process.env.JWT_KEY)

            const activeAdmin = await User.findOne({_id: decoded.active})

            if (activeAdmin.isAdmin === true) {
                const products = await Product.find({})

                const decoded = await jwt.verify(kuki, process.env.JWT_KEY)
                res.render(`adminprodlist`, { lists: products})
            } else {
                res.redirect(`/products`)
            }

        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

module.exports = router