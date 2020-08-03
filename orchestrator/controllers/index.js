const Redis = require('ioredis')
const redis = new Redis()
const axios = require('axios')

class Controllers {
    static async getAll (req, res, next) {
        try {
            let dataMovie = await redis.get('movies')
            let dataTvSeries = await redis.get('tvseries')
            if (dataMovie && dataTvSeries) {
                res.status(200).json({
                    movies:JSON.parse(dataMovie), 
                    tvseries:JSON.parse(dataTvSeries)
                })
            } else {
                let responseMovie = await axios.get('http://localhost:3001')
                let responseTvSeries = await axios.get('http://localhost:3002')
                await redis.set('movies', JSON.stringify(responseMovie.data))
                await redis.set('tvseries', JSON.stringify(responseTvSeries.data))
                for (let i = 0; i < responseTvSeries.data.length; i++) {
                    await redis.set(`tvseries:${responseTvSeries.data[i]._id}`, JSON.stringify(responseTvSeries.data[i]))
                }
                for (let i = 0; i < responseMovie.data.length; i++) {
                    await redis.set(`movie:${responseMovie.data[i]._id}`, JSON.stringify(responseMovie.data[i]))
                }
                await redis.set
                res.status(200).json({
                    movies: responseMovie.data, 
                    tvseries: responseTvSeries.data
                })
            } 
        } catch (error) {
            next(error)
        }
    }

    static async findMovieById (req, res, next) {
        try {
            let movie = await redis.get(`movie:${req.params.id}`)
            if (movie) {
                res.status(200).json(JSON.parse(movie))
            } else {
                let {data} = await axios(`http://localhost:3001/${req.params.id}`)
                await redis.set(`movie:${data._id}`,
                JSON.stringify(data))
                res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static async findTvSeriesById (req, res, next) {
        try {
            let movie = await redis.get(`tvseries:${req.params.id}`)
            if (movie) {
                res.status(200).json(JSON.parse(movie))
            } else {
                let {data} = await axios(`http://localhost:3002/${req.params.id}`)
                await redis.set(`tvseries:${data._id}`,
                JSON.stringify(data))
                res.status(200).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    static async createTvSeries (req, res, next) {
        try {
            let {title, overview, posterPath, popularity, tags} = req.body
            let {data} = await axios({
                url: `http://localhost:3002`,
                method: 'post',
                data: {
                    title,
                    overview,
                    posterPath,
                    popularity,
                    tags
                }
            })
            let tempData = await redis.get('tvseries')
            tempData = JSON.parse(tempData)
            tempData.push(data)
            await redis.set('tvseries', JSON.stringify(tempData))
            await redis.set(`tvseries:${data._id}`, JSON.stringify(data))
            res.status(200).json(data)
        
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async createMovies (req, res, next) {
        try {
            let {title, overview, posterPath, popularity, tags} = req.body
            let {data} = await axios({
                url: `http://localhost:3001`,
                method: 'post',
                data: {
                    title,
                    overview,
                    posterPath,
                    popularity,
                    tags
                }
            })
            let tempData = await redis.get('movies')
            tempData = JSON.parse(tempData)
            tempData.push(data)
            await redis.set('movies', JSON.stringify(tempData))
            await redis.set(`movie:${data._id}`, JSON.stringify(data))
            res.status(200).json(data)
        
        } catch (error) {
            next(error)
        }
    }

    static async updateTvSeries (req, res, next) {
        try {
            let {title, overview, posterPath, popularity, tags} = req.body
            let {data} = await axios({
                url: `http://localhost:3002/${req.params.id}`,
                method: 'patch',
                data: {
                    title,
                    overview,
                    posterPath,
                    popularity,
                    tags
                }
            })
            let tempData = await redis.get('tvseries')
            tempData = JSON.parse(tempData)
            tempData.push(data)
            await redis.set('tvseries', JSON.stringify(tempData))
            await redis.set(`tvseries:${data._id}`, JSON.stringify(data))
            res.status(200).json(data)
        
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async updateMovies (req, res, next) {
        try {
            let {title, overview, posterPath, popularity, tags} = req.body
            let {data} = await axios({
                url: `http://localhost:3001/${req.params.id}`,
                method: 'patch',
                data: {
                    title,
                    overview,
                    posterPath,
                    popularity,
                    tags
                }
            })
            let tempData = await redis.get('movies')
            tempData = JSON.parse(tempData)
            tempData.push(data)
            await redis.set('movies', JSON.stringify(tempData))
            await redis.set(`movie:${data._id}`, JSON.stringify(data))
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async deleteMovie (req, res, next) {
        try {
            let {data} = await axios({
                url: `http://localhost:3001/${req.params.id}`,
                method: 'delete'
            })
            console.log(data)
            let tempData = await redis.get('movies')
            tempData = JSON.parse(tempData)
            // let arrTemp = []
            for (let i = 0; i < tempData.length; i ++) {
                if (tempData[i]._id == data._id) {
                    console.log('masuk sini', tempData)
                    tempData.splice(i, 1)
                    console.log(tempData, 'setelah')
                } 
                // else {
                //     arrTemp.push(tempData[i])
                // }
            }
            await redis.set('movies', JSON.stringify(tempData))
            await redis.del(`movie:${data._id}`)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async deleteTvSerie (req, res, next) {
        try {
            let {data} = await axios({
                url: `http://localhost:3002/${req.params.id}`,
                method: 'delete'
            })
            let tempData = await redis.get('tvseries')
            tempData = JSON.parse(tempData)
            console.log(data)
            console.log(tempData)
            // let arrTemp = []
            for (let i = 0; i < tempData.length; i ++) {
                if (tempData[i]._id == data._id) tempData.splice(i, 1)
                // else {
                //     arrTemp.push(tempData[i])
                // }
            }
            await redis.set('tvseries', JSON.stringify(tempData))
            await redis.del(`tvseries:${data._id}`)
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = Controllers