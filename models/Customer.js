// imports
const mongoose = require('mongoose');
// const Joi = require('joi');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    name: String,
    addressBook: [{
        country: {
            type: String,
            required: true
        },
        fullName: String,
        phone: {
            type: String,
            required: true
        },
        street: String,
        building: String,
        landmark: String
    }],
    orders: [{
        order_ref: {
            type: Schema.Types.ObjectId,
            ref: 'orders',
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    avatar: String,
    cart: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
        },
        qty: {
            type: Number
        },
        price: {
            type: Number
        },
        expected_date: {
            type: Date
        },
    }],
    wishlist: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
        },
        qty: {
            type: Number
        },
        price: {
            type: Number
        }
    }],
});

const Customer = mongoose.model('customers', CustomerSchema);

module.exports.customers = Customer;