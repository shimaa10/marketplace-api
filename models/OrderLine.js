const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderLineSchema = new Schema({
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
    subtotal: {
        type: Number
    },
    expected_date: {
        type: Date
    },
    state: {
        type: String,
        enum: [
            'draft',
            'shipped',
            'delivered',
            'cancelled'
        ],
        default: 'draft'
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
    },

})

const OrderLine = mongoose.model('orderLines', OrderLineSchema);

module.exports.orderLines = OrderLine;