const Movies = require('../models/Movie')

class MoviesController {
    static create(req, res, next) {
        let {title, overview, posterPath, popularity, tags} = req.body
        Movies.create({
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
        Movies.find()
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }

    static findOne(req, res, next) {
        let {id} = req.params
        Movies.findById(id)
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
        Movies.findByIdAndUpdate(id, {
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
        Movies.findByIdAndDelete(id)
        .then (result => {
            res.status(200).json(result)
        })
        .catch (err => {
            next(err)
        })
    }
}

module.exports = MoviesController