const express = require(`express`)
const router = express.Router()

// Models
const Order = require(`../../models/orders/orders`)

router.get(`/getallorders`, async (req, res) => {

    const allOrders = await Order.find({}).populate('orderedItems').populate('orderBy')

    res.json({
        data: allOrders
    })

})

module.exports = router