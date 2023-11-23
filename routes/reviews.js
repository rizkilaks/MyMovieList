// const express = require('express')
// const router = express.Router({ mergeParams: true })
// const catchAsync = require('../utils/catchAsync')
// const Watchlist = require('../models/watchlist')
// const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
// const Review = require('../models/review')
// const expressError = require('../utils/expressError')
// const reviews = require('../controllers/reviews')


// router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

// module.exports = router