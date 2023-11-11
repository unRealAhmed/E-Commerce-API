const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage
} = require('../controllers/productController');

const router = express.Router();
// Route for handling reviews associated with a product
router.use('/:productId/reviews', reviewRouter);

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication and admin access)
router.use(protect, restrictTo('admin'));

router.post('/', createProduct);

router
  .route('/:id')
  .patch(uploadProductImage, resizeProductImage, updateProduct)
  .delete(deleteProduct);

module.exports = router;
