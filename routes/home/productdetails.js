const express = require(`express`)
const mongoose = require(`mongoose`)
const router = express.Router()

const product = require(`../../schemas/products/productSchema`)

router.get(`/:prodId`, (req, res) => {

    const kuki = req.session.ID 
    const _id = req.params.prodId

    if (!kuki) {
        res.render(`login`)
    } else {
        product.findById({_id}, (err, mats) => {
            if (err) {
                console.log(err)
            } else {
                // console.log(mats)
                res.render(`prodpreview`, {aytem: mats})  
            }
        })
    }

})

module.exports = router
