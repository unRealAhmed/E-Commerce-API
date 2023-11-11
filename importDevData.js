const fs = require('fs');
require('dotenv').config({ path: './config.env' });
const Product = require('./models/productModel');
const connectDatabase = require('./utilities/dataBase');

const productsData = JSON.parse(fs.readFileSync(`${__dirname}/DevData/products.js`, 'utf-8'))

const start = async () => {
  try {
    await connectDatabase(); // Connect to the database

    // First, delete existing data
    await Product.deleteMany();

    // Then, create new data
    await Product.create(productsData, { validateBeforeSave: false });

    console.log('Data deleted and loaded successfully👍');
  } catch (error) {
    console.log(error);
  }

  process.exit();
};

start();