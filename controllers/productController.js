const multer = require('multer');
const sharp = require('sharp');
const asyncHandler = require('../utilities/asyncHandler');
const AppError = require('../utilities/appErrors');
const resourceController = require('./resourceController');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

// Resource Controllers

const docType = 'product'

exports.getAllProducts = resourceController.getAll(Product);
exports.createProduct = resourceController.createOne(Product);
exports.getProduct = resourceController.getOne(Product, docType);
exports.updateProduct = resourceController.updateOne(Product, docType);

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.id;

  // Find the product by ID
  const product = await Product.findById(productId);

  // Check if the product exists
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Delete all reviews associated with the product
  await Review.deleteMany({ product: productId });

  // Delete the product
  await Product.deleteOne({ _id: productId });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Multer Configuration
const multerStorage = multer.memoryStorage();

// Check if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // Allow the upload
    cb(null, true);
  } else {
    // Reject the upload
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadProductImage = upload.single('image');

// Image Resizing Middleware
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { id } = req.params;
  req.body.image = `user-${id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1024, 1024)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/products/${req.body.image}`);

  next();
});
