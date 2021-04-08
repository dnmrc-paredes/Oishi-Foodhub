const express = require(`express`)
const createError = require(`http-errors`)
const router = express.Router()

// Models
const CartItem = require(`../../models/cartItems/cartItem`)
const User = require(`../../models/users/userSchema`)

router.post(`/plusitem/:id`, async (req, res, next) => {

    const toIncrement = req.params.id

    try {

        await CartItem.findOneAndUpdate({_id: toIncrement}, {
            $inc: {
                qty: 1
            }
        })

        res.redirect(`/mycart`)
        
    } catch (err) {
        next(createError(400, err))
    }

})

router.post(`/minusitem/:id`, async (req, res, next) => {

    const toDecrement = req.params.id

    const currentUser = await User.findOne({_id: req.session.currentUser}).populate('carts').populate({
        path: 'carts',
        populate: 'itemName',
    })

    const ifZero = currentUser.carts.find(el => el.qty <= 1)
    
    if (ifZero) {

        await User.findOneAndUpdate({_id: req.session.currentUser}, {
            $pull: {
                carts: toDecrement
            }
        })

        await CartItem.findOneAndRemove({_id: toDecrement})

        return res.redirect(`/mycart`)

    } else {

        await CartItem.findOneAndUpdate({_id: toDecrement}, {
            $inc: {
                qty: -1
            }
        })

        return res.redirect(`/mycart`)

    }

})


module.exports = router