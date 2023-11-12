const mongoose = require('mongoose');

// Define the SingleOrderItem schema
const SingleOrderItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of the product.'],
  },
  image: {
    type: String,
    required: [true, 'Please provide the image of the product.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price of the product.'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the amount of the product.'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product reference is required.'],
  },
});

// Define the Order schema
const orderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, 'Please provide the tax amount.'],
    },
    shippingFee: {
      type: Number,
      required: [true, 'Please provide the shipping fee.'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Please provide the subtotal amount.'],
    },
    total: {
      type: Number,
      required: [true, 'Please provide the total amount.'],
    },
    orderItems: {
      type: [SingleOrderItemSchema],
      required: [true, 'Please provide the order items.'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
        message: '{VALUE} is not a valid order status.',
      },
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required.'],
    },
    clientSecret: {
      type: String,
      required: [true, 'Client secret is required.'],
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
