const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Product Category Schema
const ProductCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'productCategories'
    }
});

mongoose.model('productCategories', ProductCategorySchema);

module.exports.productCategories = ProductCategorySchema;


