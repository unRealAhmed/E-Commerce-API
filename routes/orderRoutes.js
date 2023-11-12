const express = require('express');
const {
  getAllOrders,
  getOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// Apply the protect middleware to all routes below
router.use(protect);

// Routes for managing all orders (accessible only by admin)
router
  .route('/')
  .get(restrictTo('admin'), getAllOrders)
  .post(createOrder);

// Route for fetching current user's orders
router.route('/showAllMyOrders').get(getCurrentUserOrders);

// Routes for managing a specific order
router
  .route('/:id')
  .get(getOrder)
  .patch(updateOrder);

module.exports = router;
