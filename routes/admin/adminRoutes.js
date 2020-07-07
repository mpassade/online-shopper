const express = require('express')
const router = express.Router()
const Category = require('./categories/models/Category')
const {checkCategory, validateCategory} = require('./categories/utils/checkCategory')
const {createProducts} = require('./products/controllers/createProducts')



router.get('/add-category', (req, res, next) => {
    res.render('admin/add-category')
})

router.post(
    '/add-category', 
    checkCategory, 
    validateCategory,
    (req, res, next) => {
        const category = new Category()

        category.name = req.body.name

        category.save().then(()=> {
            return next()
        })
        .catch(err => {
            if (err.code ===11000){
                req.flash('errors', 'Category already exists')
                return res.redirect('/api/admin/add-category')
            } else {
                return next(err)
            }
        })
    }, 
    createProducts
)

// router.get('/create-product/:name', (req, res) => {
//     waterfall(
//         [
//             callback => {
//                 Category.findOne({name: req.params.name}, (err, category) => {
//                     if (err) return next(err)
//                     callback(null, category)
//                 })
//             },

//             (category) => {
//                 for (let i=0; i<24; i++){
//                     const product = new Product()
//                     product.category = category._id
//                     product.name = faker.commerce.productName()
//                     product.price = faker.commerce.price()
//                     product.image = `/images/products2/${i}.jpg`
//                     product.description = faker.lorem.paragraph()
//                     product.save()
//                 }
//             }
//         ]
//     )
//     req.flash('messages', `Successfully added ${req.params.name.toUpperCase()} category and 24 products`)
//     return res.redirect('/api/admin/add-category')
// })

module.exports = router