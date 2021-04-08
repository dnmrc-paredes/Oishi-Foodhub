const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)
const CartItem = require(`../../models/cartItems/cartItem`)

router.post(`/deleteitemcart/:id`, async (req, res, next) => {

    const kuki = req.session.ID
    const queryToDelete = req.params.id

    try {

        const decode = jwt.verify(kuki, process.env.JWT_KEY)

        const currentUser = await User.findOneAndUpdate({_id: decode.active}, {
            $pull: {
                carts: queryToDelete
            }
        })

        const deleteItem = await CartItem.findOneAndRemove({_id: queryToDelete})

        res.redirect(`/mycart`)
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router

// if (pwet) {
//     await CartItem.findOneAndUpdate({_id: pwet._id}, {qty: qty + 1})
//     console.log(`tae`)
//     return res.redirect(`/mycart`)
// } else {
//     await User.findOneAndUpdate({_id: decode.active}, {
//         $addToSet: {
//             carts: currentItem._id
//         }
//     })
//     console.log(`wala`)
//     return res.redirect(`/mycart`)
// }
