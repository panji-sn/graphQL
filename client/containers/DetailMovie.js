import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from "apollo-boost"
import {Image, ScrollView, Alert, View} from 'react-native'
import {Text, Container, Content, Spinner, Button, Icon} from 'native-base'

const FetchDetailMovie = gql`
    query ($id:String){
        GetMovie (id:$id) {
            poster_path
            id
            title
            vote_average
            vote_count
            overview
            genres
            production_companies
            production_countries
            release_date
            runtime
        }
    }
`
const CreateMovie = gql`
    mutation (
        $title:String,
        $overview:String,
        $posterPath:String,
        $popularity:Float,
        $tags:[String]
    ) {
        CreateMovies (
            title:$title,
            overview:$overview,
            posterPath:$posterPath,
            popularity:$popularity,
            tags:$tags
            ) {
                title
                popularity
                overview
                posterPath
                _id
            }
    }
`

const FetchMoviesDatabase = gql`
    {
        Movies {
            title
            popularity
            posterPath
            overview
            _id
        }
    }
`

export default function DetailMovie ({navigation}) {
    const { loading, error, data } = useQuery(FetchDetailMovie, {
        variables: {id:String(navigation.state.params.id)}
    })
    const tes = useQuery(FetchMoviesDatabase)
    const [addMovie, result] = useMutation(CreateMovie,{
        update: (cache, { data: {CreateMovies} }) => {
            console.log('masuk', CreateMovies)
            let {Movies} = cache.readQuery({query: FetchMoviesDatabase})
            console.log(Movies)
            cache.writeQuery({
                query: FetchMoviesDatabase,
                data: {Movies: [...Movies, CreateMovies]}
            })
            // setTitle('')
            // setOverview('')
            // setPosterPath('')
            // setPopularity(0.0)
            // setTags('')
            Alert.alert('Success', 'Film Added To library', [
                {text: 'oke'}
            ])
        }
    })
    if (loading) return (
        <Container>
            <Content>
                <Spinner color='blue' />
            </Content>
        </Container>
        )
      if (error) {
          console.log(error)
          return <Text>Error :(</Text>;
        }
    return (
    <ScrollView>
        <View style={{margin:20, alignItems:'center'}}>
            <Image 
            source={{uri: `http://image.tmdb.org/t/p/w500/${data.GetMovie.poster_path}`}}
            style={{width:300, height:400, borderRadius:20, marginBottom:10}} />
            <Button onPress={() => addMovie({
                variables: {
                    title:data.GetMovie.title, overview:data.GetMovie.overview, posterPath:`http://image.tmdb.org/t/p/w500/${data.GetMovie.poster_path}`, 
                    popularity: Number(data.GetMovie.vote_average), tags:data.GetMovie.genres
                }
            })} rounded>
            <Icon active name="library-movie" style={{fontSize:20}} type="MaterialCommunityIcons" />
                    <Text>Add To Library</Text>
            </Button>
            <View style={{backgroundColor:'rgba(63, 81, 181, 0.8)', borderRadius:10, padding:5, marginTop:10}}>
                <Text style={{textAlign: 'center', fontSize:30}}>{data.GetMovie.title}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text>Rating: </Text>
                    <Icon active name="star" style={{fontSize:20}} />
                    <Text> {data.GetMovie.vote_average}</Text>
                </View>
                <Text>{data.GetMovie.production_companies}, {data.GetMovie.production_countries}</Text>
                <View style={{flexDirection:'row'}}>
                <Text>Genres:</Text>
                <Text> {data.GetMovie.genres.join(', ')}</Text>       
                </View>
                <Text>Runtime: {data.GetMovie.runtime} minutes</Text>
                <Text>Release: {data.GetMovie.release_date}</Text>
                <Text>Total votes: {data.GetMovie.vote_count} votes</Text>
                <Text style={{textAlign:'center'}}>Synopsis: {data.GetMovie.overview}</Text>
            </View>
        </View>
    </ScrollView>
    )
}