const routes = require('express').Router()
const Controller = require('../controllers')


routes.get('/', Controller.getAll)

routes.get('/movies/:id', Controller.findMovieById)

routes.get('/tvseries/:id', Controller.findTvSeriesById)

routes.post('/tvseries', Controller.createTvSeries)

routes.post('/movies', Controller.createMovies)

routes.patch('/tvseries/:id', Controller.updateTvSeries)

routes.patch('/movies/:id', Controller.updateMovies)

routes.delete('/movies/:id', Controller.deleteMovie)

routes.delete('/tvseries/:id', Controller.deleteTvSerie)

module.exports = routes