require('dotenv').config()

const express = require(`express`)
const mongoose = require(`mongoose`)
const bodyParser = require(`body-parser`)
const ejs = require(`ejs`)
const cookieSession = require(`cookie-session`)

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
    passwordConfirmation: String,
    isAdmin: Boolean
})

const productsSchema = new mongoose.Schema({
    name: String,
    price: Number
})

const user = new mongoose.model(`user`, registerSchema)
const product = new mongoose.model(`product`, productsSchema)

app.get(`/`, (req, res) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.render(`login`)
    } else {
        res.render(`home`)
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

    user.findOne({email, password}, (err, foundAcc) => {

        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc.email !== email || foundAcc.password !== password) {
                res.send(`Mali`)
            }  else if (foundAcc.email === email && foundAcc.password === password && foundAcc.isAdmin === true) {
                const kuki = req.session.ID = foundAcc._id
                res.render(`home`)
            } else if (foundAcc.email === email && foundAcc.password === password) {
                const kuki = req.session.ID = foundAcc._id
                res.render(`home`)
            }
        }

    })

})



app.get(`/signup`, (req, res) => {
    res.render(`register`)
})

app.post(`/signup`, (req, res) => {

    const { email, password, passwordConfirmation } = req.body

    const person = new user ({
        email,
        password,
        passwordConfirmation
    })

    

    user.findOne({email, password, passwordConfirmation}, (err, existAcc) => {
        if (err) {
            console.log(err)
        } if (!email && !password && !passwordConfirmation) {
            res.send(`Please fill in all inputs`)
        } else if (email && !password && !passwordConfirmation) {
            res.render(`password`)
        } else if (email && password & !passwordConfirmation) {
            res.render(`password`)
        } else if (email && !password & passwordConfirmation) {
            res.render(`password`)
        } else if (!email && password && !passwordConfirmation) {
            res.render(`password`)
        } else if (!email && password & passwordConfirmation) {
            res.render(`email`)
        } else if (!email && !password && passwordConfirmation) {
            res.send(`Email and Password is required`)
        } else if (password !== passwordConfirmation ) {
            res.send(`Password must match`)
        } else if (email && password && passwordConfirmation) {
            person.save()
            const kuki = req.session.ID = person._id
            console.log(kuki)
            res.render(`home`)
        } else if (existAcc) {
            if (existAcc.email === email) {
                console.log(existAcc)
                res.send(`Email already exist`)
            } 
        }
    })

    
})

app.get(`/home`, (req, res) => {

    const kuki = req.session.ID
    console.log(kuki)

    if (!kuki) {
        res.render(`login`)
    } else {
        res.render(`home`)
    }

})

app.get(`/contact`, (req, res) => {
    res.render(`contact`)
})

app.get(`/adminpanel`, (req, res) => {

    const kuki = req.session.ID
    console.log(kuki)

    user.findOne({_id: kuki}, (err, foundAcc) => {
        if (err) {
            console.log(err)
        } else if (foundAcc) {
            if (foundAcc.isAdmin === true) {
                res.render(`admin`)
            } else {
                res.render(`notadmin`)
            }
        }
    })

})

app.get(`/logout`, (req, res) => {

    req.session = null

    res.redirect(`/`)

})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running`)
})