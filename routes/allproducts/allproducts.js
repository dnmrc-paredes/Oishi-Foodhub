const express = require(`express`)
const createError = require(`http-errors`)
const mongoose = require(`mongoose`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const Products = require(`../../models/products/productSchema`)

router.get(`/products`, async (req, res, next) => {

    const kuki = req.session.ID
    const pagination = req.query.pagination ? parseInt(req.query.pagination) : 8
    const page = req.query.page ? parseInt(req.query.page) : 1

    if (!kuki) {
        res.redirect(`/`)
    } else {

        try {

            const decoded = jwt.verify(kuki, process.env.JWT_KEY)
            const allProducts = await Products.find({}).limit(pagination).skip((page - 1 ) * pagination)
    
            res.render(`home`, {product: allProducts})
            
        } catch (err) {
            next(createError(err.status, err))        
        }

    }

})

module.exports = router