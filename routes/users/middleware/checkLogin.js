const {check, validationResult} = require('express-validator')

module.exports = {
    checkLogin: [
        check('email').not().isEmpty(),
        check('password').not().isEmpty(),
    ],

    validateLogin: (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash('errors', 'All fields are required')
            return res.redirect('/api/users/login')
        } else {
            next()
        }
    }
}


