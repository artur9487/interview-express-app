"use strict";
/** @format */
const mongooose = require('mongoose');
var productSchema = new mongooose.Schema({
    Name: { type: String, required: true, maxLength: 100 },
    Price: { type: Number, required: true },
    UpdateDate: Date
});
module.exports = new mongooose.model('Product', productSchema);
