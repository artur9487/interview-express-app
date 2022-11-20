/** @format */

const express = require('express');
import { Express, Request, Response } from 'express';
const app: Express = express();
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

interface allProductsSchema {
	Name: String;
	id: String;
}

interface singleProductSchema extends allProductsSchema {
	Price: Number;
	UpdateDate: Date;
}

app.get('/', (req: Request, res: Response) => {
	Products.find()
		.sort({ UpdateDate: -1 })
		.then((products: allProductsSchema[]) => {
			const productsList: { Name: String; id: String }[] = products.map(
				(item: allProductsSchema) => {
					return { Name: item.Name, id: item.id };
				}
			);
			return res.json(productsList);
		})
		.catch((err: string) => res.status(400).json('Error:' + err));
});

app.get('/:id', (req: Request, res: Response) => {
	Products.find({ _id: req.params.id })
		.sort({ UpdateDate: -1 })
		.then((products: singleProductSchema) => {
			return res.json(products);
		})
		.catch((err: string) => res.status(400).json('Error:' + err));
});

app.post('/', (req: Request, res: Response) => {
	const newProductBody = { ...req.body, UpdateDate: new Date() };
	const newProduct = new Products(newProductBody);
	newProduct
		.save()
		.then(() => {
			return res.json('product Added');
		})
		.catch((err: string) => res.status(400).json('Error:' + err));
});

app.put('/:id', (req: Request, res: Response) => {
	const newProductBody = { ...req.body, UpdateDate: new Date() };
	const productID = req.params.id;

	Products.replaceOne({ _id: productID }, newProductBody)
		.then(() => res.json('product Updated'))
		.catch((err: string) => res.status(400).json('Error:' + err));
});

app.delete('/:id', (req: Request, res: Response) => {
	Products.deleteOne({
		_id: req.params.id
	})
		.then(() => {
			return res.json('product deleted');
		})
		.catch((err: string) => res.status(400).json('Error:' + err));
});

app.listen(process.env.PORT || 5000, () =>
	console.log('Example app is listening on port 5000.')
);
