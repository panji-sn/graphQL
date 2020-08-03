const {gql, ApolloServer, ApolloError, makeExecutableSchema} = require('apollo-server')
const axios = require('axios')
const {movieResolvers, movieTypeDefs} = require('./Movie')
const {tvSeriesResolvers, tvSeriesTypeDefs} = require('./TvSerie')

const typeDefs = gql`
    type Query 
    type Mutation
`

const schema = makeExecutableSchema({
    typeDefs: [typeDefs, movieTypeDefs, tvSeriesTypeDefs],
    resolvers: [movieResolvers, tvSeriesResolvers]
})
  const server = new ApolloServer({ 
      schema });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Seerver ready at ${url}`);
  });