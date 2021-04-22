require('dotenv').config()
const express = require(`express`)
const mongoose = require(`mongoose`)
const bodyParser = require(`body-parser`)
const ejs = require(`ejs`)
const cookieSession = require(`cookie-session`)
const bcrypt = require(`bcrypt`)
const createError = require(`http-errors`)

const loginRootRouter = require(`./routes/root/root`)
const registerRouter = require(`./routes/register/register`)
const allProductsHomeRouter = require(`./routes/allproducts/allproducts`)
const oneProductRouter = require(`./routes/oneproduct/oneproduct`)
const adminAddProductRouter = require(`./routes/adminaddproduct/adminaddproduct`)
const adminPanelRouter = require(`./routes/adminpanel/adminpanel`)
const adminDeleteProductRouter = require(`./routes/admindeleteproduct/admindeleteproduct`)
const deleteItemCartRouter = require(`./routes/deleteitemcart/deleteitemcart`)
const ItemCounterRouter = require(`./routes/plusAndMinusItems/plusMinus`)
const checkoutRouter = require(`./routes/checkout/checkout`)
const usersCartRouter = require(`./routes/mycart/mycart`)
const contactRouter = require(`./routes/contact/contact`)
const logoutRouter = require(`./routes/logout/logout`)
const adminAllOrdersRouter = require(`./routes/adminAllOrders/adminAllOrders`)

// Admin Q's
const AdminGetAllUser = require(`./routes/getAllUsers/getAllUsers`)
const AdminGetAllOrders = require(`./routes/getAllOrders/getAllOrders`)

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(`public`))
app.set(`view engine`, `ejs`)
app.set('trust proxy', 1)
app.use(cookieSession ({
    name: `auth-session`,
    keys: [`${process.env.KEY}`]
}))

mongoose.connect(`mongodb+srv://TmAdmin:${process.env.PASSWORD}@cluster0.c7khy.mongodb.net/oishiFH?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, 'useFindAndModify': false})

app.use(loginRootRouter)
app.use(registerRouter)
app.use(allProductsHomeRouter)
app.use(oneProductRouter)
app.use(adminAddProductRouter)
app.use(adminPanelRouter)
app.use(adminDeleteProductRouter)
app.use(deleteItemCartRouter)
app.use(ItemCounterRouter)
app.use(checkoutRouter)
app.use(usersCartRouter)
app.use(contactRouter)
app.use(logoutRouter)
app.use(adminAllOrdersRouter)

// Admin Q's
app.use(AdminGetAllUser)
app.use(AdminGetAllOrders)

app.use((req, res, next) => {
    next(createError(404, `URL not found`))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        status: err.status,
        message: err.message,
        err: err
    })
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running`)
})

