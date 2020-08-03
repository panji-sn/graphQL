import React from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from "apollo-boost"
import {Image, ScrollView, Alert, View} from 'react-native'
import {Text, Container, Content, Spinner, Button, Icon} from 'native-base'

const FetchDetailTv = gql`
    query ($id:String){
        GetTvSerie (id:$id) {
            poster_path
            id
            name
            vote_average
            vote_count
            overview
            genres
            created_by
            first_air_date
            number_of_episodes
            number_of_seasons
            episode_run_time
        }
    }
`
const CreateTv = gql`
    mutation (
        $title:String,
        $overview:String,
        $posterPath:String,
        $popularity:Float,
        $tags:[String]
    ) {
        CreateTvSeries (
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
const FetchTvDatabase = gql`
    {
        TvSeries {
            title
            popularity
            posterPath
            overview
            _id
        }
    }
`
export default function DetailTvSerie ({navigation}) {
    const { loading, error, data } = useQuery(FetchDetailTv, {
        variables: {id:String(navigation.state.params.id)}
    })
    const tes = useQuery(FetchTvDatabase)
    const [addTv, result] = useMutation(CreateTv,{
        update: (cache, { data: {CreateTvSeries} }) => {
            console.log('masuk', CreateTvSeries)
            let {TvSeries} = cache.readQuery({query: FetchTvDatabase})
            console.log(TvSeries)
            cache.writeQuery({
                query: FetchTvDatabase,
                data: {TvSeries: [...TvSeries, CreateTvSeries]}
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
    // <Text>{JSON.stringify(data.GetTvSerie)}</Text>
    <ScrollView>
        <View style={{margin:20, alignItems:'center'}}>
            <Image 
            source={{uri: `http://image.tmdb.org/t/p/w500/${data.GetTvSerie.poster_path}`}}
            style={{width:300, height:400, borderRadius:20, marginBottom:10}} />
            <Button onPress={() => addTv({
                variables: {
                    title:data.GetTvSerie.name, overview:data.GetTvSerie.overview, 
                    posterPath:`http://image.tmdb.org/t/p/w500/${data.GetTvSerie.poster_path}`, 
                    popularity: Number(data.GetTvSerie.vote_average), tags:data.GetTvSerie.genres
                }
            })} rounded>
            <Icon active name="library-movie" style={{fontSize:20}} type="MaterialCommunityIcons"
            />
                    <Text>Add To Library</Text>
            </Button>
            <View style={{backgroundColor:'rgba(63, 81, 181, 0.8)', borderRadius:10, padding:5, marginTop:10}}>
                <Text style={{textAlign: 'center', fontSize:30}}>{data.GetTvSerie.name}</Text>
                <View style={{flexDirection:'row'}}>
                    <Text>Rating: </Text>
                    <Icon active name="star" style={{fontSize:20}} />
                    <Text> {data.GetTvSerie.vote_average}</Text>
                </View>
                <Text>Created by: {data.GetTvSerie.created_by}</Text>
                <Text>Total Episodes: {data.GetTvSerie.number_of_episodes}</Text>
                <Text>Total Seasons: {data.GetTvSerie.number_of_seasons}</Text>
                <View style={{flexDirection:'row'}}>
                <Text>Genres:</Text>
                    {
                        data.GetTvSerie.genres.map((item, index) => {
                            return (
                        <Text key={index}> {item}</Text>
                            )
                        })
                    }
                </View>
                <Text>Runtime: {data.GetTvSerie.episode_run_time} minutes</Text>
                <Text>First Release: {data.GetTvSerie.first_air_date}</Text>
                <Text>Total votes: {data.GetTvSerie.vote_count} votes</Text>
                <Text style={{textAlign:'center'}}>Synopsis: {data.GetTvSerie.overview}</Text>
            </View>
        </View>
    </ScrollView>
    )
}