import React, {useState} from 'react'
import { TextInput, View, Dimensions, Alert} from 'react-native'
import {Text, Button} from 'native-base'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from "apollo-boost"
const { width } = Dimensions.get('window')
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

export default function CreateForm () {
    const [title, setTitle] = useState('')
    const [overview, setOverview] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [popularity, setPopularity] = useState(0.0)
    const [tags, setTags] = useState('')
    const tes = useQuery(FetchMoviesDatabase)
    const [addMovie, {error, data, loading}] = useMutation(CreateMovie,{
        update: (cache, { data: {CreateMovies} }) => {
            console.log('masuk', CreateMovies)
            let {Movies} = cache.readQuery({query: FetchMoviesDatabase})
            console.log(Movies)
            cache.writeQuery({
                query: FetchMoviesDatabase,
                data: {Movies: [...Movies, CreateMovies]}
            })
            setTitle('')
            setOverview('')
            setPosterPath('')
            setPopularity(0.0)
            setTags('')
            Alert.alert('Success', 'Film Added to Library', [
                {text: 'oke'}
            ])
        }
    })
    // const [] = useQuery(FetchMovies)

    if (loading) return <Text>Loading...</Text>;
  if (error) {
      console.log(error)
      return <Text>Error :(</Text>;
    }
    return (
        <View style={{marginTop:40, marginHorizontal:20}}>
            <TextInput style={{width:width-20}} onChangeText={(text) => setTitle(text)} value={title} placeholder='Input title' />
            <TextInput multiline numberOfLines={5} onChangeText={(text) => setOverview(text)} value={overview} placeholder='Input Synopsis' />
            <TextInput onChangeText={(text) => setPosterPath(text)} value={posterPath}  placeholder='Input Poster Path'/>
            <TextInput onChangeText={(text) => setPopularity(Number(text))} value={popularity} placeholder='Input Popularity' keyboardType='decimal-pad'/>
            <TextInput onChangeText={(text) => setTags(text)} value={tags} placeholder='Input Tag. For multiple tags use , as separator'/>
            <Button title="submit" onPress={() => addMovie({
                variables: {title, overview, posterPath, popularity: Number(popularity), tags: tags.split(',')}
            })}>
                <Text style={{textAlign:'center'}}>Save</Text>
            </Button> 
            {/* {
                tes.data &&
            <Text>{JSON.stringify(tes.data)}</Text>
            } */}
        </View>
        
    )
}