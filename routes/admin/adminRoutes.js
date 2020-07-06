const express = require('express')
const router = express.Router()
const Category = require('./categaories/models/Category')
const {validationResult} = require('express-validator')
const checkCategary = require('./categaories/utils/checkCategory')


router.get('/add-category', (req, res, next) => {
    res.render('admin/add-category')
})

router.post('/add-category', checkCategary, (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            req.flash('errors', errors.errors[0].msg)
            return res.redirect('/api/admin/add-category')
        }
        const category = new Category()

        category.name = req.body.name

        category.save().then(savedCategory => {
            req.flash('messages', 'Successfully added category')
            return res.redirect('/api/admin/add-category')
            // req.json({message: 'Success', category: savedCategory})
        }).catch(err => {
            if (err.code ===11000){
                req.flash('errors', 'Category already exists')
                return res.redirect('/api/admin/add-category')
            } else {
                return next(err)
            }
        })
})

module.exports = router