require('dotenv').config()

const express = require(`express`)
const mongoose = require(`mongoose`)
const bodyParser = require(`body-parser`)
const ejs = require(`ejs`)
const cookieSession = require(`cookie-session`)
const bcrypt = require(`bcrypt`)







const saltRounds = 10

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(`public`))
app.set(`view engine`, `ejs`)
app.set('trust proxy', 1)
app.use(cookieSession ({
    name: `auth-session`,
    keys: [`${process.env.KEY}`]
}))

mongoose.connect(`mongodb+srv://TmAdmin:${process.env.PASSWORD}@cluster0.c7khy.mongodb.net/oishiFH?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const registerSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
})

const productsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
})

const cartSchema = new mongoose.Schema({
    items: String,
    price: Number
})

const user = new mongoose.model(`user`, registerSchema)
const product = new mongoose.model(`product`, productsSchema)
const cart = new mongoose.model(`cart`, cartSchema)


app.get(`/`, (req, res) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {
        res.redirect(`/home`)
    }

})

app.post(`/`, (req, res) => {

    const { email, password } = req.body

    if (email === "" && password === "") {
        res.render(`tryagain`)
    } else if (email && password === "") {
        res.render(`password`)
    } else if (email === "" && password) {
        res.render(`email`)
    }

    user.findOne({email}, (err, foundAcc) => {
        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc) {
                bcrypt.compare(password, foundAcc.password, function(err, result) {
                    if (result === true) {
                        const kuki = req.session.ID = foundAcc._id
                        res.redirect(`/home`)
                    } else if (result === false) {
                        res.render(`login`)
                    } else {
                        res.render(`login`)
                    }
                })
            }
        } else {
            res.render(`login`)
        }

    })

})



app.get(`/signup`, (req, res) => {
    res.render(`register`)
})

app.post(`/signup`, (req, res) => {

    const { email, password} = req.body

    bcrypt.hash(password, saltRounds, function(err, hash) {

    const person = new user ({
        email,
        password: hash
    })

    user.findOne({email, password}, (err, existAcc) => {

        if (err) {
            console.log(err)
        } else if (existAcc) {
            if (existAcc.email === email) {
                console.log(existAcc)
                res.render(`userexists`)
            } 
        } else if (email === "" && password === "" ) {
            res.render(`fillup`)
        } else if (email && password === "") {
            res.render(`password`)
        } else if (email === "" && password ) {
            res.render(`email`)
        } else if (email && password) {
            person.save()
            const kuki = req.session.ID = person._id
            console.log(kuki)
            console.log(hash)
            res.redirect(`/home`)
        } 

    })
    })

})

app.get(`/home`, (req, res) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {

        product.find({}, (err, items) => {
            if (err) {
                console.log(err)
            } else {
                if (items) {
                    
                        res.render(`home`, {product: items})

                }
            }
        })

    }

})

app.get(`/contact`, (req, res) => {
    res.render(`contact`)
})

app.get(`/logout`, (req, res) => {

    req.session = null

    res.redirect(`/`)
    
})

app.get(`/adminpanel`, (req, res) => {

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

app.get(`/addproduct`, (req, res) => {

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

app.post(`/addproduct`, (req, res) => {

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

app.post(`/:deleteitem/delete`, (req, res) => {

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






















app.get(`/:prodId`, (req, res) => {

    const kuki = req.session.ID
    const pradakSelected = req.params.prodId

    // mongoose.Types.ObjectId.isValid(pradakSelected);

    if (!kuki) {
        res.render(`login`)
    } else {

        if (pradakSelected.match(/^[0-9a-fA-F]{24}$/)) {
            product.findById({_id: pradakSelected}, (err, mats) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(mats)
                    res.render(`prodpreview`, {aytem: mats})
                }
            })
          }
          
    }

})

// app.get(`/:prodId`, (req, res) => {

//     const kuki = req.session.ID 
//     const _id = req.params.prodId

//     if (!kuki) {
//         res.render(`login`)
//     } else {
//         product.findById({_id}, (err, mats) => {
//             if (err) {
//                 console.log(err)
//             } else {
//                 // console.log(mats)
//                 res.render(`prodpreview`, {aytem: mats})  
//             }
//         })
//     }
    
// })

// app.post(`/cart`, (req, res) => {

//     const _id = req.body.itemid

//     product.findById({_id}, (err, foundItem) => {
//         if (err) {
//             console.log(err)
//         } else {
//             if (foundItem) {
//                 const cart = req.session.cartId = foundItem._id
//                 const box = req.session.box = ({items: [{ item: cart, quantity: 1 }]})
//                 if (cart) {
//                     if (box.items[0].item === cart) {
//                         box.items[0].quantity++
//                     }
//                 } else {
//                     box.items.push({items: [{ item: cart, quantity: 1 }]})
//                 }

//                 console.log(box)
//                 res.render(`cart`, {cartItem: foundItem})
//             }
//         }
//     })
// })



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`)
})

