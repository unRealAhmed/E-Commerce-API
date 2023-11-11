const mongoose = require('mongoose');

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

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Virtual populate
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
})

reviewSchema.pre(/^find/, function (next) {
  this.select('-updatedAt')
  next()
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review
