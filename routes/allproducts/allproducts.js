const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const Products = require(`../../models/products/productSchema`)

router.get(`/products`, async (req, res, next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.redirect(`/`)
    } else {

        try {

            const decoded = await jwt.verify(kuki, process.env.JWT_KEY)
            const allProducts = await Products.find({})
    
            res.render(`home`, {product: allProducts})
            
        } catch (err) {
            next(createError(err.status, err))        
        }

    }

})

module.exports = router