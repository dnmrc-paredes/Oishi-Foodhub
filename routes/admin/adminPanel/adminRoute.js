const express = require(`express`)
const mongoose = require(`mongoose`)

const user = require(`../../../schemas/users/userSchema`)
const product = require(`../../../schemas/products/productSchema`)
const router = express.Router()


router.get(`/adminpanel`, (req, res) => {

    const kuki = req.session.ID

    user.findOne({_id: kuki}, (err, foundAcc) => {
        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc.isAdmin === true) {

                product.find({}, (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(data)

                        res.render(`adminprodlist`, {lists: data})
                    }
                })

                
            } else {
                res.render(`notadmin`)
            }
        }
    })

})

module.exports = router