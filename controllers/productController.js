const multer = require('multer');
const sharp = require('sharp');
const asyncHandler = require('../utilities/asyncHandler');
const AppError = require('../utilities/appErrors');
const resourceController = require('./resourceController');
const Product = require('../models/productModel');

// Resource Controllers
exports.getAllProducts = resourceController.getAll(Product);
exports.getProduct = resourceController.getOne(Product);
exports.createProduct = resourceController.createOne(Product);
exports.updateProduct = resourceController.updateOne(Product);
exports.deleteProduct = resourceController.deleteOne(Product);

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
