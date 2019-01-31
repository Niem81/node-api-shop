'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = Schema({
    name: String,
    description: String,
    picture: String,
    price: { type: Number, default: 0 },
    garment: { type: mongoose.Schema.Types.ObjectId, ref: 'Garment' },
    quantity: Number,
})

module.exports = mongoose.model('Product', ProductSchema)
