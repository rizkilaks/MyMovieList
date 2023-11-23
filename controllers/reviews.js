// const Review = require('../models/review')
// const Watchlist = require('../models/watchlist')

// module.exports.createReview = async (req, res) => {
//     const watchlist = await Watchlist.findById(req.params.id)
//     const review = new Review(req.body.review)
//     review.author = req.user._id
//     watchlist.reviews.push(review)
//     await review.save()
//     await watchlist.save()
//     req.flash('success', 'Created new review')
//     res.redirect(`/watchlists/${watchlist._id}`)
// }

// module.exports.deleteReview = async (req, res) => {
//     const { id, reviewId } = req.params
//     await Watchlist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
//     await Review.findByIdAndDelete(reviewId)
//     req.flash('success', 'Successfully deleted the review')
//     res.redirect(`/watchlists/${id}`)
// }