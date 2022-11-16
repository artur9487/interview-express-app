/** @format */
const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
	Name: { type: String, required: true, maxLength: 100 },
	Price: { type: Number, required: true },
	UpdateDate: Date
});

module.exports = new mongoose.model('Product', productSchema);
