const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const Product = require(`../../models/products/productSchema`)

router.get(`/product/:id`, async (req, res ,next) => {

    const kuki = req.session.ID
    const queryProduct = req.params.id

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {

            await Product.findOne({_id: queryProduct}, async (err, foundProduct) => {
                if (err) {
                    console.log(err)
                } else if (foundProduct) {
                    const decoded = await jwt.verify(kuki, process.env.JWT_KEY)
                    res.render(`prodpreview`, {aytem: foundProduct})
                }

            })
            
            // res.render(`prodpreview`)

        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

module.exports = router