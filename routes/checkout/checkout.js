const express = require(`express`)
const router = express.Router()
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Models
const User = require(`../../models/users/userSchema`)
const Order = require(`../../models/orders/orders`)
const CartItem = require(`../../models/cartItems/cartItem`)

router.post(`/checkout`, async (req, res) => {

    const userID = req.session.currentUser

    const currentUser = await User.findOne({_id: userID})

    const newOrder = await new Order({
        orderBy: userID,
        orderedItems: currentUser.carts
    })

    await newOrder.save()

    const currentOrder = await Order.findOne({_id: newOrder._id}).populate('orderedItems').populate('orderBy').populate({
        path: 'orderedItems',
        populate: 'itemName'
    })

    const activateIsCheckout = await User.findOne({_id: userID}).populate('carts').populate({
        path: 'carts',
        populate: 'itemName',
    })

    const getNames = currentOrder.orderedItems.map(item => item.itemName.name )
    const getQties = currentOrder.orderedItems.map(item => item.qty)

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

    // console.log(orderNames)
    // console.log(orderQties)

    if (orderTotal === 0) {
        console.log(orderTotal)
        return res.redirect(`/mycart`)
    } else {
        console.log(orderTotal)
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