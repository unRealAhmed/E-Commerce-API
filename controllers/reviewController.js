const Review = require("../models/reviewModel");
const { getAll, getOne } = require("./resourceController");
const asyncHandler = require("../utilities/asyncHandler");
const AppError = require("../utilities/appErrors");


exports.getAllReviews = getAll(Review)
exports.getReview = getOne(Review, 'review');

exports.setReviewUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = asyncHandler(async (req, res, next) => {
  const productId = req.body.product;
  const { user } = req;

  // Check if the product ID is present in the request body
  if (!req.body.product) {
    throw new AppError('Product ID is required for creating a review.', 400);
  }

  // Check if the user has already reviewed the product
  const existingReview = await Review.findOne({ product: productId, user: user._id });

  if (existingReview) {
    throw new AppError('You have already reviewed this product.', 400);
  }

  // If not, proceed with creating the review
  const newReview = await Review.create({
    ...req.body,
    user: user._id,
    product: productId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  const productId = req.body.product;
  const { user } = req;

  const existingReview = await Review.findOne({ product: productId, user: user._id });
  if (existingReview) {
    // 1. Find and update the document
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validators on update
    });

    // 2. Handle the case when no document is found
    if (!review) {
      return next(new AppError(`No review found with that ID`, 404));
    }

    // 3. Send a success response with the updated data
    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  }
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const productId = req.body.product;
  const { user } = req;

  const existingReview = await Review.findOne({ product: productId, user: user._id });
  if (existingReview) {
    // 1. Find and delete a document by its ID
    const review = await Review.findByIdAndDelete(req.params.id);

    // 2. If no document is found, handle it as an error
    if (!review) {
      return next(new AppError(`No review found with that ID`, 404));
    }

    // 3. Send a success response with no data (204 status code)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } else {
    return next(new AppError("you don't have permission to do this action", 400))
  }
});