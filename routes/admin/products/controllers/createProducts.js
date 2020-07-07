const {waterfall} = require('async')
const faker = require('faker')
const Product = require('../models/Product')
const Category = require('../../categories/models/Category')

module.exports = {
    createProducts: (req, res, next) => {
        waterfall(
            [
                callback => {
                    Category.findOne({name: req.body.name}, (err, category) => {
                        if (err) return next(err)
                        callback(null, category)
                    })
                },

                category => {
                    for (let i=0; i<24; i++){
                    const product = new Product()
                    product.category = category._id
                    product.name = faker.commerce.productName()
                    product.price = faker.commerce.price()
                    product.image = `/images/products2/${i}.jpg`
                    product.description = faker.lorem.paragraph()
                    product.save()
                    .catch(err => {
                        if (err) return next(err)
                    })
                    }
                }
            ]
        )
        
        req.flash('messages', `Successfully added ${req.body.name.toUpperCase()} category and 24 products`)
        return res.redirect('/api/admin/add-category')
    }
}
