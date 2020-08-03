import React, {useState} from 'react'
import { TextInput, View, Dimensions, Alert} from 'react-native'
import {Text, Button, Content, Container, Spinner} from 'native-base'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from "apollo-boost"
const { width } = Dimensions.get('window')

const UpdateMovie = gql`
    mutation (
        $title:String,
        $overview:String,
        $posterPath:String,
        $popularity:Float,
        $tags:[String],
        $_id:String
    ) {
        UpdateMovie (
            title:$title,
            overview:$overview,
            posterPath:$posterPath,
            popularity:$popularity,
            tags:$tags,
            _id:$_id
            ) {
                title
                popularity
                overview
                posterPath
                _id
                tags
            }
    }
`

const FetchMovieDatabase = gql`
    query ($_id:String){
        Movie(_id:$_id) {
            title
            popularity
            posterPath
            overview
            _id
            tags
        }
    }
`

export default function UpdateFormMovie ({navigation}) {
    const [title, setTitle] = useState('')
    const [overview, setOverview] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [popularity, setPopularity] = useState(0.0)
    const [tags, setTags] = useState([''])
    const {data, error, loading} = useQuery(FetchMovieDatabase, {
        variables: {_id:navigation.state.params._id},
        onCompleted: async () => {
            await setTitle(data.Movie.title)
            await setPosterPath(data.Movie.posterPath)
            await setOverview(data.Movie.overview)
            await setPopularity(String(data.Movie.popularity))
            await setTags(data.Movie.tags.join(','))
        }
    })
    const [updateMovie, result] = useMutation(UpdateMovie, {
        onCompleted: () => {
            Alert.alert('Success', 'Film Updated', [
                {text: 'oke'}
            ])
        }
    })
    // const [] = useQuery(FetchMovies)

    if (loading) return (
    <Container>
        <Content>
            <Spinner color='blue' />
        </Content>
    </Container>)
  if (error) {
      console.log(error)
      return <Text>Error :(</Text>;
    }
    return (
    // <Text>{JSON.stringify(data.Movie)}</Text>
        <View style={{marginTop:40, marginHorizontal:20, backgroundColor:'rgba(63, 81, 181, 0.8)'}}>
            <Text>Title:</Text>
            <TextInput autoFocus style={{width:width-20}} onChangeText={(text) => setTitle(text)} value={title} placeholder='Input title' />
            <Text>Synopsis:</Text>
            <TextInput multiline numberOfLines={5} onChangeText={(text) => setOverview(text)} value={overview} placeholder='Input Synopsis' />
            <Text>Poster Link:</Text>
            <TextInput onChangeText={(text) => setPosterPath(text)} value={posterPath}  placeholder='Input Poster Path'/>
            <Text>Popularity:</Text>
            <TextInput onChangeText={(text) => setPopularity(Number(text))} value={popularity} placeholder='Input Popularity' keyboardType='decimal-pad'/>
            <Text>Tags:</Text>
            <TextInput onChangeText={(text) => setTags(text)} value={tags} placeholder='Input Tag'/>
            <Button title="submit" onPress={() => updateMovie({
                variables: {title, overview, posterPath, popularity:Number(popularity), tags:tags.split(','), _id:data.Movie._id}
            })}>
                <Text style={{textAlign:'center'}}>Update</Text>
            </Button> 
            {/* {
                tes.data &&
            <Text>{JSON.stringify(tes.data)}</Text>
            } */}
        </View>
        
    )
}