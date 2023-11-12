const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const asyncHandler = require('../utilities/asyncHandler');
const { getAll, getOne } = require('./resourceController');
const AppError = require('../utilities/appErrors');

const fakeStripeAPI = async ({ amount }) => {
  const clientSecret = 'someRandomValue';
  return { clientSecret, amount };
};

exports.getAllOrders = getAll(Order)
exports.getOrder = getOne(Order)

// Separate function to fetch products and calculate total
const processOrderItems = async (cartItems, tax, shippingFee) => {
  const orderItems = [];
  let subtotal = 0;

  const productPromises = cartItems.map(async (item) => {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new AppError(`No product with id: ${item.product}`, 400);
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // Add item to order
    orderItems.push(singleOrderItem);

    // Calculate subtotal
    subtotal += item.amount * price;
  });

  await Promise.all(productPromises);

  const total = tax + shippingFee + subtotal;

  return { orderItems, subtotal, total };
};

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  // Check if cart items are provided
  if (!cartItems || cartItems.length < 1) {
    return next(new AppError('No cart items provided', 400));
  }

  // Check if tax and shipping fee are provided
  if (!tax || !shippingFee) {
    return next(new AppError('Please provide tax and shipping fee', 400));
  }

  try {
    // Fetch products and calculate total
    const { orderItems, subtotal, total } = await processOrderItems(cartItems, tax, shippingFee);

    // Generate payment intent
    const paymentIntent = await fakeStripeAPI({ amount: total, currency: 'usd' });

    // Create order
    const order = await Order.create({
      orderItems,
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: paymentIntent.clientSecret,
      user: req.user.id,
    });

    res.status(201).json({
      order,
      clientSecret: order.clientSecret,
    });
  } catch (error) {
    // Handle unexpected errors
    next(new AppError('Error creating the order', 500));
  }
});

exports.getCurrentUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({ results: orders.length, orders, });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    return next(new AppError(`No order with id : ${orderId}`, 404))
  }

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(200).json({ order });
});
