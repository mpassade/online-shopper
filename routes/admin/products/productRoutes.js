const router = require('express').Router()
const Product = require('./models/Product')

router.get('/get-products/:id', (req, res, next) => {
    Product.find({category: req.params.id})
    .populate('category')
    .exec((err, foundProducts) => {
        if (err) return next(err)
        return res.render('main/category', {products: foundProducts})
    })
})

module.exports = router