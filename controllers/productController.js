const Product = require('../models/productModel');
const resourceController = require('./resourceController');

exports.getAllProducts = resourceController.getAll(Product)
exports.getProduct = resourceController.getOne(Product)
exports.createProduct = resourceController.createOne(Product)
exports.updateProduct = resourceController.updateOne(Product)
exports.deleteProduct = resourceController.deleteOne(Product)