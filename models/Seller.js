const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Seller Schema
const SellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: String,
    mobile: {
        type: String,
        required: true
    },
    email: String,
    acceptedPayments: [
        {
            type: String,
            enum: ['cash', 'credit card', 'paypal'],
            default: 'cash'
        }
    ],
    avatar: String
});


const Seller = mongoose.model("sellers", SellerSchema);
module.exports.Seller = Seller;

