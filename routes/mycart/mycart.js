const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)

router.get(`/mycart`, async (req, res, next) => {

    const kuki = req.session.ID

    try {

        const decode = jwt.verify(kuki, process.env.JWT_KEY)

        const currentUser = await User.findOne({_id: decode.active})

        const userCart = currentUser.carts

        res.render(`carts`, {userCart})
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

router.post(`/mycart`, async (req, res, next) => {

    const buyingItem = req.body.itemid
    const kuki = req.session.ID

    try {

        const decode = jwt.verify(kuki, process.env.JWT_KEY)

        const find = await Product.findOne({_id: buyingItem})

        const currentUser = await User.findOneAndUpdate({_id: decode.active}, {
            $addToSet: {
                carts: buyingItem,
                qty: 1
            }
        })

        console.log(currentUser.carts)
        res.redirect(`/mycart`)

        // if (currentUser.carts.item.includes(find._id)) {
        //     console.log(`Meron`)
        //     return res.redirect(`/mycart`)
        // } else {
        //     currentUser.carts.item.push(find._id)
        //     currentUser.save()
        //     console.log(`wala`)
        //     return res.redirect(`/mycart`)
        // }
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router