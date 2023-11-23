const { watchlistSchema, reviewSchema } = require('./schemas.js')
const expressError = require('./utils/expressError')
const Watchlist = require('./models/watchlist.js')
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateWatchlist = (req, res, next) => {
    const { error } = watchlistSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const watchlist = await Watchlist.findById(id)
    if (!watchlist.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/watchlists/${id}`)
    }
    next()
}

// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params
//     const review = await Review.findById(reviewId)
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that')
//         return res.redirect(`/watchlists/${id}`)
//     }
//     next()
// }

// module.exports.validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body)
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new expressError(msg, 400)
//     } else {
//         next()
//     }
// }
