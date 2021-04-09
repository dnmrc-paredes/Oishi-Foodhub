const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)
const CartItem = require(`../../models/cartItems/cartItem`)

router.get(`/mycart`, async (req, res, next) => {

    const kuki = req.session.ID

    try {

        const decode = jwt.verify(kuki, process.env.JWT_KEY)
        const userID = decode.active

        const currentUser = await User.findOne({_id: decode.active}).populate('carts').populate({
            path: 'carts',
            populate: 'itemName',
        })

        const userCart = currentUser.carts.filter(item => item.isCheckout === false)

        res.render(`carts`, {userCart, userID})
        
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

        const currentItem = await new CartItem({
            itemName: buyingItem,
            itemOwner: decode.active,
            qty: 1,
        })

        await currentItem.save()

        const exist = await User.findOne({_id: decode.active}).populate('carts').populate({
            path: 'carts',
            populate: 'itemName',
        })

        const pwet = exist.carts.find(el => el.itemName._id == buyingItem && el.isCheckout === false)
        
        if (pwet) {
            await CartItem.findOneAndUpdate({_id: pwet._id}, {
                $inc: {
                    qty: 1
                }
            })
            return res.redirect(`/mycart`)
        } else {
            await User.findOneAndUpdate({_id: decode.active}, {
                $addToSet: {
                    carts: currentItem._id
                }
            })
            return res.redirect(`/mycart`)
        }
   
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router