const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)
const router = express.Router()

const User = require(`../../models/users/userSchema`)
const Order = require(`../../models/orders/orders`)

router.get(`/adminpanel/orders`, async (req, res, next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {

            const decoded = jwt.verify(kuki, process.env.JWT_KEY)
            const activeAdmin = await User.findOne({_id: decoded.active})
            const allOrders = await Order.find({}).populate('orderedItems').populate('orderBy')
            .populate({
                path: 'orderedItems',
                populate: 'itemName'
            })

            if (activeAdmin.isAdmin === true) {
                res.render(`adminallorders`, {allOrders})
            } else {
                res.redirect(`/products`)
            }

        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

module.exports = router