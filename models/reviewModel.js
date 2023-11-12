const mongoose = require('mongoose');
const Product = require('./productModel');

// Define the review schema
const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Please provide a rating of at least 1.'],
      max: [5, 'Please provide a rating no higher than 5.'],
      required: [true, 'Please provide a rating.'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide a title for your review.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide your review text.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

// Create an index to ensure uniqueness of reviews for a user and a product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Virtual populate for user and exclude updatedAt field
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  }).select('-updatedAt');
  next();
});

// Static method to calculate and update average ratings for a product
reviewSchema.statics.calcAverageRatings = async function (productId) {
  // Aggregate reviews to calculate average ratings
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  // Update the product with calculated ratings
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numOfReviews: stats[0].nRating,
      averageRating: stats[0].avgRating
    });
  } else {
    // If there are no reviews, set default ratings
    await Product.findByIdAndUpdate(productId, {
      numOfReviews: 0,
      averageRating: 0
    });
  }
};

// Middleware executed before finding and updating a review, stores original review
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.originalReview = await this.model.findOne(this.getQuery()); // retrieve the current review
  next();
});

// Middleware executed after finding and updating a review, calculates and updates ratings
reviewSchema.post(/^findOneAnd/, async function () {
  await this.originalReview.constructor.calcAverageRatings(this.originalReview.product);
});

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
