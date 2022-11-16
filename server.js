/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
let Products = require('./schema');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('MongoDB database connection established successfully');
});

app.get('/', (req, res) => {
	Products.find()
		.sort({ UpdateDate: -1 })
		.then((products) => {
			return res.json(products);
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

app.get('/:id', (req, res) => {
	Products.find({ email: req.params })
		.sort({ UpdateDate: -1 })
		.then((products) => {
			return res.json(products);
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

app.post('/', (req, res) => {
	const newProductBody = req.body;
	const newProduct = new Products(newProductBody);
	newProduct
		.save()
		.then(() => {
			return res.json('product Added');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

app.put('/:id', (req, res) => {
	const newProductBody = req.body;
	const productID = req.params.id;

	Products.replaceOne({ _id: productID }, newProductBody)
		.then(() => res.json('product Updated'))
		.catch((err) => res.status(400).json('Error:' + err));
});

app.delete('/:id', (req, res) => {
	Products.deleteOne({
		_id: req.params.id
	})
		.then(() => {
			return res.json('product deleted');
		})
		.catch((err) => res.status(400).json('Error:' + err));
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
