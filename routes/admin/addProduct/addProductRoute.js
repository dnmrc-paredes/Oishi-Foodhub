const express = require(`express`)
const mongoose = require(`mongoose`)
const router = express.Router()

const user = require(`../../../schemas/users/userSchema`)
const product = require(`../../../schemas/products/productSchema`)

router.get(`/addproduct`, (req, res) => {

    const kuki = req.session.ID

    user.findOne({_id: kuki}, (err, foundAcc) => {
        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc.isAdmin === true) {
                res.render(`addproduct`)
            } else {
                res.render(`notadmin`)
            }
        }
    })

})

router.post(`/addproduct`, (req, res) => {

    const {prodname, prodprice, proddesc} = req.body

    const newPrice = parseInt(prodprice)

    const addProduct = new product({
        name: prodname,
        price: newPrice,
        description: proddesc
    })

    if (prodname && prodprice && proddesc) {
        addProduct.save()
    }

    console.log(`succesfully added`)

    res.redirect(`/addproduct`)

})

module.exports = router