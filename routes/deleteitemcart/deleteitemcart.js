const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Product = require(`../../models/products/productSchema`)

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

        res.redirect(`/mycart`)
        
    } catch (err) {
        next(createError(err.status, err))
    }

})

module.exports = router