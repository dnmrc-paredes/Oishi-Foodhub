const express = require(`express`)
const router = express.Router()
const jwt = require(`jsonwebtoken`)
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Models
const User = require(`../../models/users/userSchema`)
const Order = require(`../../models/orders/orders`)
const CartItem = require(`../../models/cartItems/cartItem`);

router.post(`/checkout`, async (req, res) => {

    const kuki = req.session.ID
    const ifZeroPrice = +req.body.totalprice
    const decode = jwt.verify(kuki, process.env.JWT_KEY)

    const currentUser = await User.findOne({_id: decode.active}).populate('carts').populate({
        path: 'carts',
        populate: 'itemName',
    })

    const userCart = currentUser.carts.filter(item => item.isCheckout === false)
    
    let errorBox = []

    if (ifZeroPrice === 0) {
        errorBox.push({ msg: 'No items in your cart.' })
        return res.render(`carts`, {errorBox, userCart})
    }

    const newOrder = await new Order({
        orderBy: decode.active,
        orderedItems: currentUser.carts
    })

    await newOrder.save()

    const currentOrder = await Order.findOne({_id: newOrder._id}).populate('orderedItems').populate('orderBy').populate({
        path: 'orderedItems',
        populate: 'itemName'
    })

    const activateIsCheckout = await User.findOne({_id: decode.active}).populate('carts').populate({
        path: 'carts',
        populate: 'itemName',
    })

    const filterNames = currentOrder.orderedItems.filter(item => item.isCheckout === false)
    const filterQties = currentOrder.orderedItems.filter(item => item.isCheckout === false)
    const filterTotal = currentOrder.orderedItems.filter(item => item.isCheckout === false)

    const getTotal = filterTotal.map(item => {
        return item.itemName.price * item.qty
    })

    const orderNames = filterNames.map(item => item.itemName.name)
    const orderQties = filterQties.map(item => item.qty)
    const orderTotal = getTotal.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)

    if (orderTotal === 0) {

        return res.redirect(`/mycart`)

    } else {

        const doc = new PDFDocument()

        doc.pipe(fs.createWriteStream(`receipt.pdf`))

        doc.text('Oishi Foodhub', {
        align: 'center'
        })

        doc.list(orderNames)
        doc.list(orderQties)
        doc.text(`The total is $${orderTotal}`)

        doc.end()

        activateIsCheckout.carts.map(async item => {
            return await CartItem.findOneAndUpdate({_id: item._id}, {
                isCheckout: true
            })
        })

        res.redirect(`/mycart`)
    }

})

module.exports = router
