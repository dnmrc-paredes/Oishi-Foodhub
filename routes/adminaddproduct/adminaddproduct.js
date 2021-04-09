const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const Product = require(`../../models/products/productSchema`)
const User = require(`../../models/users/userSchema`)

router.get(`/adminpanel/addproduct`, async (req, res ,next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {

            const decoded = await jwt.verify(kuki, process.env.JWT_KEY)

            const activeAdmin = await User.findOne({_id: decoded.active})

            if (activeAdmin.isAdmin === true) {
                res.render(`addproduct`)
            } else {
                res.redirect(`/products`)
            }

        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

router.post(`/adminpanel/addproduct`, async (req, res, next) => {

    const {prodname, prodprice, proddesc} = req.body

    const kuki = req.session.ID

    let errorBox = []

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {
            
            if (!prodname || !prodprice || !proddesc) {
                errorBox.push({ msg: `Please input all fields`})
                return res.render(`addproduct`, {errorBox})
            } 

            const toAddProduct = await new Product ({
                name: prodname,
                price: prodprice,
                description: proddesc
            })

            await toAddProduct.save()
            
            res.redirect(`/adminpanel/addproduct`)
            
        } catch (err) {

            if (err.code === 11000) {
                errorBox.push({ msg: `Duplicate name, input another one.`})
                return res.render(`addproduct`, {errorBox})
            }

            if (err.errors.price.path === `price`) {
                errorBox.push({ msg: `Price must be a number`})
                return res.render(`addproduct`, {errorBox})
            } 


            next(createError(err.status, err))
        }

    }

})

module.exports = router