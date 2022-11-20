"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
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
        const productsList = products.map((item) => {
            return { Name: item.Name, id: item.id };
        });
        return res.json(productsList);
    })
        .catch((err) => res.status(400).json('Error:' + err));
});
app.get('/:id', (req, res) => {
    Products.find({ _id: req.params.id })
        .sort({ UpdateDate: -1 })
        .then((products) => {
        return res.json(products);
    })
        .catch((err) => res.status(400).json('Error:' + err));
});
app.post('/', (req, res) => {
    const newProductBody = Object.assign(Object.assign({}, req.body), { UpdateDate: new Date() });
    const newProduct = new Products(newProductBody);
    newProduct
        .save()
        .then(() => {
        return res.json('product Added');
    })
        .catch((err) => res.status(400).json('Error:' + err));
});
app.put('/:id', (req, res) => {
    const newProductBody = Object.assign(Object.assign({}, req.body), { UpdateDate: new Date() });
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
app.listen(process.env.PORT || 5000, () => console.log('Example app is listening on port 5000.'));
