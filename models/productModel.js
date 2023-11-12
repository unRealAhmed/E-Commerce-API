const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide the product name.'],
      maxlength: [100, 'Product name cannot exceed 100 characters.'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide the product price.'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide the product description.'],
      maxlength: [1000, 'Description cannot exceed 1000 characters.'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide the product category.'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide the company.'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not a supported company.',
      },
    },
    colors: {
      type: [String],
      required: [true, 'Please provide at least one color for the product.'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, 'Please provide the product inventory.'],
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
      set: (val) => +val.toFixed(1),
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User information is required for the product.'],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Create a virtual field for reviews associated with the product
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
});

// Pre middleware to populate user and reviews fields
productSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v',
  }).populate({
    path: 'reviews',
    select: '-__v',
  }).select('-__v');
  next();
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
