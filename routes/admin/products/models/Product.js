const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },
    name: String,
    price: Number,
    image: String,
    description: String
})

module.exports = mongoose.model('Product', ProductSchema)