const {check} = require('express-validator')

const checkCategary = [
    check('name', 'Category is required').not().isEmpty()
]

module.exports = checkCategary