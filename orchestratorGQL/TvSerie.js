const {gql, ApolloError} = require('apollo-server')
const axios = require('axios')
const Redis = require('ioredis')
const redis = new Redis()
const LinkURL = 'http://localhost:3002'

const tvSeriesTypeDefs = gql`
    type TvSerie {
        _id: String,
        title: String,
        overview: String,
        posterPath: String,
        popularity: Float,
        tags: [String]
    }

    type TvSerieTMDB {
      poster_path: String,
      id: String,
      genre_ids: [String],
      name: String,
      vote_average: Float,
      vote_count: Int,
      overview: String,
      number_of_episodes: String,
      number_of_seasons: String,
      first_air_date: String,
      genres: [String],
      production_companies: [String],
      episode_run_time: [String],
      created_by: String
    }

    extend type Query {
        TvSeries: [TvSerie],
        TvSerie(_id:String): TvSerie
        GetTvSeries: [TvSerieTMDB]
        GetTvSerie(id:String): TvSerieTMDB
    }
    extend type Mutation {
        CreateTvSeries(title:String, overview: String, posterPath:String, popularity:Float, tags:[String] ) : TvSerie,
        UpdateTvSerie(title:String, overview: String, posterPath:String, popularity:Float, tags:[String], _id:String ) : TvSerie,
        DeleteTvSerie(_id:String ) : TvSerie
    }
`

const tvSeriesResolvers = {
    Query: {
      TvSeries: async () => {
        try {
            let {data} = await axios(LinkURL)
            return data
        } catch (error) {
            throw new ApolloError('Database not connected', '500')
        }
      },
      TvSerie: async (parent, args) => {
        try {
            let {data} = await axios(`${LinkURL}/${args._id}`)
            // console.log(data)
            return data
        } catch (error) {
            throw new ApolloError('Database not connected', '500')
        }
      },
      GetTvSeries: async () => {
        try {
          let dataTv= await redis.get('tvseries')
          if (dataTv) {
             return JSON.parse(dataTv)
          } else {
              let responseTv = await axios({
                url: 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=611fee49b1950a055b75e7e7f45a6fc2&include_adult=false',
                method: 'get'
              })
              console.log(responseTv.data.results)
              let tempArr = []
              let genreList = [{
                id: 10759,
                name: "Action & Adventure"
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
                id: 10762,
                name: "Kids"
                },
                {
                id: 9648,
                name: "Mystery"
                },
                {
                id: 10763,
                name: "News"
                },
                {
                id: 10764,
                name: "Reality"
                },
                {
                id: 10765,
                name: "Sci-Fi & Fantasy"
                },
                {
                id: 10766,
                name: "Soap"
                },
                {
                id: 10767,
                name: "Talk"
                },
                {
                id: 10768,
                name: "War & Politics"
                },
                {
                id: 37,
                name: "Western"
                }]
              for (let i = 0; i < responseTv.data.results.length; i++) {
                tempArr.push(responseTv.data.results[i])
                let tempGenre = []
                for (let j = 0; j < responseTv.data.results[i].genre_ids.length; j++) {
                  for (let k = 0; k < genreList.length; k++) {
                    if (responseTv.data.results[i].genre_ids[j] === genreList[k].id) {
                      tempGenre.push(genreList[k].name)
                    }
                  }
                }
                tempArr[i].id = String(tempArr[i].id)
                tempArr[i].genre_ids = tempGenre
              }
              console.log(tempArr)
              await redis.set('tvseries', JSON.stringify(tempArr))
              return tempArr
          } 
        } catch (error) {
          console.log(error)
            throw new ApolloError('Error API', '500')
        }
      },
      GetTvSerie: async (parent, args) => {
        try {
          let TvTMDB = await redis.get(`tvTMDB:${args.id}`)
          if (TvTMDB) {
            return JSON.parse(TvTMDB)
          } else {
            let id = Number(args.id)
            let detail = await axios.get(`https://api.themoviedb.org/3/tv/${id}?&api_key=611fee49b1950a055b75e7e7f45a6fc2`)
            let tempObj = detail.data
            let tempGenre = []
            for (let i = 0; i < detail.data.genres.length; i ++) {
              tempGenre.push(detail.data.genres[i].name)
            }
            // console.log(tempObj, 'awal')
            tempObj.genres = tempGenre
            // tempObj.production_countries = [detail.data.production_countries[0].name]
            tempObj.production_companies = [detail.data.production_companies[0].name]
            tempObj.episode_run_time = [detail.data.episode_run_time[0]]
            tempObj.created_by = detail.data.created_by[0].name
            // console.log(detail.data, 'sukses masuk')
            // console.log(tempObj, 'akhir')
            await redis.set(`tvTMDB:${id}`, JSON.stringify(tempObj))
            return tempObj
          }
        } catch (error) {
          throw new ApolloError('Error API', '500')
        }
      }
    },
    Mutation: {
      CreateTvSeries: async (parents, args, context, info) => {
        try {
            // console.log(args)
            let {title, overview, posterPath, popularity,tags} = args
            // console.log(title)
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
            // console.log(hasil, "ini data _id")
            return hasil.data
        } catch (error) {
            // console.log(error)
          throw new ApolloError('Database not connected', '500')
        }
      },
      UpdateTvSerie: async (parents, args, context, info) => {
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
      DeleteTvSerie: async (parents, args, context, info) => {
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
      }
    }
  };

module.exports = {
    tvSeriesResolvers, tvSeriesTypeDefs
}