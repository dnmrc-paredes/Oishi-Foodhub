const express = require(`express`)
const jwt = require(`jsonwebtoken`)
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
    const kuki = req.session.ID

    try {

        const decode = jwt.verify(kuki, process.env.JWT_KEY)
        const currentUser = await User.findOne({_id: decode.active}).populate('carts').populate({
            path: 'carts',
            populate: 'itemName',
        })
    
        const ifZero = currentUser.carts.find(el => el.qty <= 1 && el.isCheckout === false)
        
        if (ifZero) {
    
            await User.findOneAndUpdate({_id: decode.active}, {
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
        
    } catch (err) {
        next(createError(400, err))
    }

    

})


module.exports = router