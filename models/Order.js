const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customers = mongoose.model("customers");
const orderLine = mongoose.model("orderLines");

const OrderSchema = new Schema({
    order_serial: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref:'customers'
    },
    country: {
        type: String,
        required: true5
    },
    fullName: String,
    phone: {
        type: String,
        required: true
    },
    street: String,
    building: String,
    landmark: String,
    state: {
        type: String,
        enum: [
            'draft',
            'confirmed',
            'delivered',
            'cancelled',
        ],
        default: 'draft'
    },
    total_amount: {
        type: Number,
    },
    note: {
        type: String,
    },
    payment_method: {
        type: String,
        enum: [
            'cash',
            'visa',
        ],
        default: 'cash'
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
})

const Order = mongoose.model('orders', OrderSchema);

function confirmOrder(customer, addressData){
    var cart = customer.cart;
    if(cart){
        // TEST: First prepare order data with the address.
        var newOrder = {
            'order_serial': 'SO0005',
            'customer': customer,
            'country': addressData.country,
            'street': addressData.street,
            'fullName': addressData.fullName,
            'phone': addressData.phone,
            'landmark': addressData.landmark,
            'building': addressData.building, 
        }
        new Order(newOrder)
        .save()
        .then(order => {
            // First we must create Order lines
            cart.forEach(line => {
                var newOrderLine = {
                    'product': line.product,
                    'qty': line.qty,
                    'price': line.price,
                    'subtotal': line.qty * line.price,
                    'expected_date': line.expected_date,
                    'order_id': order.id,
                }
                new orderLine(newOrderLine).save().then(linex => {
                    console.log(linex);
                    // TEST: delete the added item from cart
                    Customers.findByIdAndUpdate(
                        customer._id,
                        { $pull: {cart: { _id: line._id,},},}, 
                        { muti: false }
                        ).exec().then((result) => console.log(result));
                });
            });

            // TEST: Second  we must update customer profile by the new order
            Customers.findByIdAndUpdate(
                customer._id,
                {$addToSet: {orders: {order_ref: order.id},},},
                { new: true, useFindAndModify: false }
            ).exec().then((result) => {console.log(result);});

            return true;
        });
    } else {
        return false;
    }
}

function checkLinesStates(order_id){
    var counter = 0;
    orderLine.find({
        order_id: order_id
    }).then(lines => {
        if(!lines){
            return res.status(404).json({msg: "Order have no items found!"});
        }
        lines.forEach(line => {
            if(line.state == 'delivered') counter++;
        })
        if(lines.length == counter){
            Order.findById(order_id).then(order => {
                if(!order) {
                    return res.status(404).json({msg: "Order not found!"});
                }
                order.state ='delivered';
                order.save().then(l => { return true; });
            })
        }
    })
}


module.exports.orders = Order;
module.exports.confirm = confirmOrder;
module.exports.checkState = checkLinesStates;