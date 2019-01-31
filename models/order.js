'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = Schema({
        order: [{
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        }],
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        payment: { type: String, default: 'Cash' },
        state: {
            type: String,
            default: "pedido"
        },
        price:Number
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('Order', OrderSchema)
