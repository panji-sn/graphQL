const TvSeries = require('../models/TvSeries')

class TvSeriesController {
    static create(req, res, next) {
        let {title, overview, posterPath, popularity, tags} = req.body
        TvSeries.create({
            title,
            overview,
            posterPath,
            popularity,
            tags
        })
        .then (result => {
            res.status(201).json(result)
        })
        .catch (err => {
            next(err)
        })
    }

    static findAll(req, res, next) {
        TvSeries.find()
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }

    static findOne(req, res, next) {
        let {id} = req.params
        TvSeries.findById(id)
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }

    static update(req, res, next) {
        let {title, overview, posterPath, popularity, tags} = req.body
        let {id} = req.params
        TvSeries.findByIdAndUpdate(id, {
            title,
            overview,
            posterPath,
            popularity,
            tags
        }, {
            new: true,
            omitUndefined: true
        })
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }

    static deleteItem (req, res, next) {
        let {id} = req.params
        TvSeries.findByIdAndDelete(id)
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }
}

module.exports = TvSeriesController