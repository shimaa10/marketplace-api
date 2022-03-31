const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Product Tags Schema
const ProductTagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
});

const ProductTag = mongoose.model("productTags", ProductTagSchema);
module.exports.ProductTag = ProductTag;
