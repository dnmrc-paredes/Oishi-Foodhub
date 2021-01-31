const express = require(`express`)
const createError = require(`http-errors`)
const jwt = require(`jsonwebtoken`)

const router = express.Router()



router.get(`/contact`, async (req, res ,next) => {

    const kuki = req.session.ID

    if (!kuki) {
        res.redirect(`/`)
    } else {
        
        try {
            const decoded = await jwt.verify(kuki, process.env.JWT_KEY)
            res.render(`contact`)
        } catch (err) {
            next(createError(err.status, err))
        }

    }

})

module.exports = router