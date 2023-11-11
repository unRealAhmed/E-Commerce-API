const Review = require("../models/reviewModel");
const { getAll, createOne, getOne, updateOne, deleteOne } = require("./resourceController");

exports.setReviewUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = getAll(Review)
exports.createReview = createOne(Review)
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);