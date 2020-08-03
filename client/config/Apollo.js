import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://35.240.227.42:4000'
});

export default client