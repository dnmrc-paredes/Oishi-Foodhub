const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)

router.get(`/mycart`, async (req, res, next) => {

    res.redirect(`/products`)

})

router.post(`/mycart`, async (req, res, next) => {

    const buyingItem = req.body.itemid
    const kuki = req.session.ID

    try {

        const decode = await jwt.verify(kuki, process.env.JWT_KEY)

        const currentUser = await User.findOne({_id: decode.active})

        // currentUser.carts.item.push(buyingItem)
        // currentUser.carts.quantity.push(buyingItem)
        // currentUser.carts.item.productId.push(buyingItem)
        // currentUser.carts.quantity.push(buyingItem)
        // console.log(currentUser.carts.item)
        // console.log(currentUser.carts.quantity)
        // console.log(currentUser.carts.quantity[0].totalItem)

        // console.log(currentUser.carts.quantity[0].totalItem)
        // console.log(currentUser.carts.item)

        const find = await Product.findOne({_id: buyingItem})
        
        // console.log(currentUser.carts.item)

        // console.log(currentUser.carts.item.includes(find._id))

        if (currentUser.carts.item.includes(find._id)) {
            console.log(`Meron`)
            return res.redirect(`/mycart`)
        } else {
            currentUser.carts.item.push(find._id)
            currentUser.save()
            console.log(`wala`)
            return res.redirect(`/mycart`)
        }
        
        // console.log(currentUser.carts.quantity)

        // console.log(currentUser.carts.item.includes(find._id))
        // console.log(currentUser.carts.quantity.includes(find._id))

        // console.log(currentUser.carts.item)
        // console.log(currentUser.carts.quantity)

        // for (items of currentUser.carts.quantity) {
        //     console.log(items)
        // }

        
          
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router