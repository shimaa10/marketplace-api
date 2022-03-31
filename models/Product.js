const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Schema
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // buffer be used
    img: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:'productCategories'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref:'sellers'
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
    },
    qty: {
        type: Number,
        default: 0,
        required: true
    },
    weight: {
        type: Number,
    },
    dimension: {
        type: String,
    },
    lastRate: {
        type: Number
    },
    totalRate: {
        type: Number
    },
    status: {
        type: String,
        enum: [
            'inStock',
            'shipping',
            'outStock'
        ],
        default: 'outStock'
    },
    productReview: [{
        title: {
            type: String
        },
        rate: {
            type: Number
        },
        reviewDate: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
    }],
    tag: {
        type: Schema.Types.ObjectId,
        ref: 'productTags'
    },
    // varients: [{
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     value: {
    //         type: String,
    //         required: true
    //     }
    // }],
    // images: {

    // },
});

const Product = mongoose.model("products", ProductSchema);


//function to validate product
// function validateProduct(product) {
//     return schema = {
//         name: Joi.string().min(3).max(50).required(),
//         code: Joi.string().min(3).max(20).required(),
//     };
// }


module.exports.Product = Product;
// module.exports.validate = validateProduct;
