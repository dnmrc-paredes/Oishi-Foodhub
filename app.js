require('dotenv').config()

const express = require(`express`)
const mongoose = require(`mongoose`)
const bodyParser = require(`body-parser`)
const ejs = require(`ejs`)
const cookieSession = require(`cookie-session`)
const bcrypt = require(`bcrypt`)

const loginRouter = require(`./routes/login/loginRouter`)
const signUpRouter = require(`./routes/signUp/signUpRouter`)
const homeRouter = require(`./routes/home/homeRoute`)
const contactRouter = require(`./routes/contact/contactRoute`)
const logoutRouter = require(`./routes/logout/logoutRoute`)
const adminRouter = require(`./routes/admin/adminPanel/adminRoute`)
const addProductRouter = require(`./routes/admin/addProduct/addProductRoute`)
const deleteProductRouter = require(`./routes/admin/deleteProduct/deleteProdRoute`)

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

app.use(loginRouter)
app.use(signUpRouter)
app.use(homeRouter)
app.use(contactRouter)
app.use(logoutRouter)
app.use(adminRouter)
app.use(addProductRouter)
app.use(deleteProductRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`)
})

