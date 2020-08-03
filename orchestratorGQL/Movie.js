const {gql, ApolloError} = require('apollo-server')
const axios = require('axios')
const Redis = require('ioredis')
const redis = new Redis()
const LinkURL = 'http://localhost:3001'

const movieTypeDefs = gql`
    type Movie {
        _id: String,
        title: String,
        overview: String,
        posterPath: String,
        popularity: Float,
        tags: [String]
    }

    type MovieTMDB {
      poster_path: String,
      id: String,
      genre_ids: [String],
      title: String,
      vote_average: Float,
      vote_count: Int,
      overview: String,
      genres: [String],
      production_companies: [String],
      production_countries: [String],
      release_date: String,
      runtime: Int
    }
    
    extend type Query {
        Movies: [Movie],
        Movie(_id:String): Movie,
        GetMovies: [MovieTMDB]
        GetMovie(id:String): MovieTMDB
    }
    extend type Mutation {
        CreateMovies(title:String, overview: String, posterPath:String, popularity:Float, tags:[String] ) : Movie,
        UpdateMovie(title:String, overview: String, posterPath:String, popularity:Float, tags:[String], _id:String ) : Movie,
        DeleteMovie(_id:String ) : Movie,
    }
`

const movieResolvers = {
    Query: {
      Movies: async () => {
        try {
            let {data} = await axios(LinkURL)
            console.log(data, 'ini data')
            return data
        } catch (error) {
            throw new ApolloError('Database not connected', '500')
        }
      },
      Movie: async (parent, args) => {
        try {
            let {data} = await axios(`${LinkURL}/${args._id}`)
            // console.log(data)
            return data
        } catch (error) {
            throw new ApolloError('Database not connected', '500')
        }
      },
      GetMovies: async () => {
        try {
          let dataMovie = await redis.get('movies')
          if (dataMovie) {
             return JSON.parse(dataMovie)
          } else {
              let responseMovie = await axios({
                url: 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=611fee49b1950a055b75e7e7f45a6fc2&include_adult=false',
                method: 'get'
              })
              console.log(responseMovie.data.results)
              let tempArr = []
              let genreList = [{
                id: 28,
                name: "Action"
                },
                {
                id: 12,
                name: "Adventure"
                },
                {
                id: 16,
                name: "Animation"
                },
                {
                id: 35,
                name: "Comedy"
                },
                {
                id: 80,
                name: "Crime"
                },
                {
                id: 99,
                name: "Documentary"
                },
                {
                id: 18,
                name: "Drama"
                },
                {
                id: 10751,
                name: "Family"
                },
                {
                id: 14,
                name: "Fantasy"
                },
                {
                id: 36,
                name: "History"
                },
                {
                id: 27,
                name: "Horror"
                },
                {
                id: 10402,
                name: "Music"
                },
                {
                id: 9648,
                name: "Mystery"
                },
                {
                id: 10749,
                name: "Romance"
                },
                {
                id: 878,
                name: "Science Fiction"
                },
                {
                id: 10770,
                name: "TV Movie"
                },
                {
                id: 53,
                name: "Thriller"
                },
                {
                id: 10752,
                name: "War"
                },
                {
                id: 37,
                name: "Western"
                }]
              for (let i = 0; i < responseMovie.data.results.length; i++) {
                tempArr.push(responseMovie.data.results[i])
                let tempGenre = []
                for (let j = 0; j < responseMovie.data.results[i].genre_ids.length; j++) {
                  for (let k = 0; k < genreList.length; k++) {
                    if (responseMovie.data.results[i].genre_ids[j] === genreList[k].id) {
                      tempGenre.push(genreList[k].name)
                    }
                  }
                }
                tempArr[i].id = String(tempArr[i].id)
                tempArr[i].genre_ids = tempGenre
              }
              console.log(tempArr)
              await redis.set('movies', JSON.stringify(tempArr))
              return tempArr
          } 
        } catch (error) {
          console.log(error)
            throw new ApolloError('Error API', '500')
        }
      },
      GetMovie: async (parent, args) => {
        try {
          let FilmTMDB = await redis.get(`movieTMDB:${args.id}`)
          if (FilmTMDB) {
            return JSON.parse(FilmTMDB)
          } else {
            let id = Number(args.id)
            let detail = await axios.get(`https://api.themoviedb.org/3/movie/${id}?&api_key=611fee49b1950a055b75e7e7f45a6fc2`)
            let tempObj = detail.data
            let tempGenre = []
            for (let i = 0; i < detail.data.genres.length; i ++) {
              tempGenre.push(detail.data.genres[i].name)
            }
            // console.log(tempObj, 'awal')
            tempObj.genres = tempGenre
            tempObj.production_countries = [detail.data.production_countries[0].name]
            tempObj.production_companies = [detail.data.production_companies[0].name]
            // console.log(detail.data, 'sukses masuk')
            // console.log(tempObj, 'akhir')
            await redis.set(`movieTMDB:${id}`, JSON.stringify(tempObj))
            return tempObj
          }
        } catch (error) {
          console.log(error)
          throw new ApolloError('Error API', '500')
        }
      }
    },
    Mutation: {
      CreateMovies: async (parents, args, context, info) => {
          try {
            //   console.log(args)
              let {title, overview, posterPath, popularity,tags} = args
            //   console.log(title)
              let hasil= await axios({
                  url: `${LinkURL}`,
                  method: 'post',
                  data: {
                      title,
                      overview,
                      posterPath, 
                      popularity,
                      tags
                  }
              })
              console.log(hasil, "ini data _id")
              return hasil.data
          } catch (error) {
            //   console.log(error)
            throw new ApolloError('Database not connected', '500')
          }
      },
      UpdateMovie: async (parents, args, context, info) => {
        try {
            console.log(args)
            let {title, overview, posterPath, popularity,tags, _id} = args
          //   console.log(title)
            let hasil= await axios({
                url: `${LinkURL}/${_id}`,
                method: 'patch',
                data: {
                    title,
                    overview,
                    posterPath, 
                    popularity,
                    tags
                }
            })
            console.log(hasil, "ini data _id")
            return hasil.data
        } catch (error) {
          //   console.log(error)
          throw new ApolloError('Database not connected', '500')
        }
      },
      DeleteMovie: async (parents, args, context, info) => {
        try {
            console.log(args)
            let {_id} = args
          //   console.log(title)
            let hasil= await axios({
                url: `${LinkURL}/${_id}`,
                method: 'delete'
            })
            console.log(hasil, "ini data _id")
            return hasil.data
        } catch (error) {
          //   console.log(error)
          throw new ApolloError('Database not connected', '500')
        }
      },
    }
  };

module.exports = {
    movieTypeDefs, movieResolvers
}