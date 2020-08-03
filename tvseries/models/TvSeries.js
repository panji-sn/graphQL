const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TvSerieSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title cannot be empty']
    },
    overview: {
        type: String,
        required: [true, 'Overview cannot be empty']
    },
    posterPath: {
        type: String,
        required: [true, 'Poster Link cannot be empty']
    },
    popularity: {
        type: Number,
        required: [true, 'Popularity cannot be empty']
    },
    tags: {
        type: Array,
        required: [true, 'Tags cannot be empty']
    }
}, {
    versionKey: false
})

const TvSeries = mongoose.model('TvSeries', TvSerieSchema)

module.exports = TvSeries