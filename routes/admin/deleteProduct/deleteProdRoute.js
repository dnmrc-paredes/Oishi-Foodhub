const express = require(`express`)
const router = express.Router()
const user = require(`../../../schemas/users/userSchema`)
const product = require(`../../../schemas/products/productSchema`)

router.post(`/:deleteitem/delete`, (req, res) => {

    const item = req.params.deleteitem

    console.log(item)
    
    product.findOneAndDelete({_id: item}, (err, foundItem) => {
        if (err) {
            console.log(err)
        } else {
            if (foundItem) {
                console.log(`Item Deleted`)
                res.redirect(`/home`)
            }
        } 
    })

})

module.exports = router