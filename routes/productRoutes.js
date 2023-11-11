const express = require('express');

const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes (require authentication and admin access)
router.use(protect, restrictTo('admin'));

router.post('/', createProduct);

router
  .route('/:id')
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = router;
