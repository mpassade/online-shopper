const {check, validationResult} = require('express-validator')

module.exports = {

    checkCategory: [
        check('name', 'Category is required').not().isEmpty()
    ],

    validateCategory: (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash('errors', errors.errors[0].msg)
            return res.redirect('/api/admin/add-category')
        }
        next()
    }
}