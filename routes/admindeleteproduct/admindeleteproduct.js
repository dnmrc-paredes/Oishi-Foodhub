const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const Product = require(`../../models/products/productSchema`)

router.post(`/delete/:id`, async (req, res, next) => {

    const queryDeletingProduct = req.params.id

    try {

        await Product.findOneAndDelete({_id: queryDeletingProduct})
        res.redirect(`/adminpanel`)
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router