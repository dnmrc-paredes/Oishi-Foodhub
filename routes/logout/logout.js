const express = require(`express`)
const router = express.Router()

router.get(`/logout`, async (req, res, next) => {

    req.session.ID = null

    res.redirect(`/`)

})

module.exports = router