const joi = require('joi')
const { number } = require('joi')
const { ImageSchema } = require('./models/watchlist');

module.exports.watchlistSchema = joi.object({
    watchlist: joi.object({
        title: joi.string().required(),
        year: joi.number().required().min(1980).max(2023),
        // images: joi.object().required(), // still dont know how to validate an array of images
        status: joi.string().required(),
        genre: joi.string().required(),
        country: joi.string().required(),
        rating: joi.number().min(0).max(5),
        preference: joi.alternatives(
            joi.array(),
            joi.string()),
        notes: joi.string().allow('')
    }).required(),
    deleteImages: joi.array()
})