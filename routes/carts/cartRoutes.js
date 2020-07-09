const router = require('express').Router()
const Cart = require('./models/Carts')

router.post('/:product_id', (req, res, next) => {
    Cart.findOne({owner: req.user._id})
    .then(cart => {
        cart.items.push({
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
        })

        cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2)

        cart.save().then(() => {
            return res.redirect('/api/cart')
        }).catch(err => {
            next(err)
        })
    }).catch(err => {
        next(err)
    })
})

router.get('/', (req, res, next) => {
    Cart.findOne({owner: req.user._id})
    .populate('items.item')
    .exec((err, foundCart) => {
        if (err) return next(err)
        return res.render('main/cart', {
            foundCart, 
            messages: req.flash('remove')
        })

    })
})

router.post('/product/remove', (req, res, next) => {
    Cart.findOne({owner: req.user._id})
    .then(cart => {
        cart.items.pull(String(req.body.item))
        cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2)

        cart.save().then(cart => {
            req.flash('remove', 'Successfully removed')
            return res.redirect('/api/cart')
        })
    })
})
module.exports = router