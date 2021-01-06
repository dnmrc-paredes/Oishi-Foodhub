const express = require(`express`)
const user = require(`../../schemas/users/userSchema`)
const product = require(`../../schemas/products/productSchema`)

const router = express.Router()

router.get(`/home`, (req, res) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {

        product.find({}, (err, items) => {
            if (err) {
                console.log(err)
            } else {
                if (items) {
                    
                        res.render(`home`, {product: items})

                }
            }
        })

    }

})

module.exports = router