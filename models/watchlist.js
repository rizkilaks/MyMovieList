const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const WatchlistSchema = new Schema({
    title: String,
    year: Number,
    status: String,
    genre: String,
    // genre2: String,
    // genre3: String,
    country: String,
    rating: Number,
    preference: Array,
    images: [ImageSchema],
    notes: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// abandoned idea below, might come in handy in the future

// WatchlistSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         await Review.deleteOne({
//             _id: {
//                 $in: doc.reviews
//             }
//         })
//     }
// })

module.exports = mongoose.model("Watchlist", WatchlistSchema);

// module.exports = {
//     Watchlist: mongoose.model('Watchlist', WatchlistSchema),
//     ImageSchema: ImageSchema
// }
