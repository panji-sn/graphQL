import React, {useState} from 'react'
import { gql } from "apollo-boost"
import { TextInput, View} from 'react-native'
import {Text, Button} from 'native-base'
import { useMutation, useQuery } from '@apollo/react-hooks'

const ADD_MOVIE = gql`
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
const FetchMovies = gql`
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

export default function AddMovie () {
    const [title, setTitle] = useState('')
    const [overview, setOverview] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [popularity, setPopularity] = useState(0.0)
    const [tags, setTags] = useState('')
    const [addMovie, {error, data, loading}] = useMutation(ADD_MOVIE,{
        update: (cache, { data: {CreateMovies} }) => {
            const {Movies} = cache.readQuery({query: FetchMovies})
            cache.writeQuery({
                query: FetchMovies,
                data: {Movies: [...Movies, CreateMovies]}
            })
        }
    })
    // const [] = useQuery(FetchMovies)

    if (loading) return <Text>Loading...</Text>;
  if (error) {
      console.log(error)
      return <Text>Error :(</Text>;
    }
    return (
        <View style={{marginTop:40}}>
            <TextInput onChangeText={(text) => setTitle(text)} value={title} placeholder='Input title' />
            <TextInput onChangeText={(text) => setOverview(text)} value={overview} placeholder='Input title' />
            <TextInput onChangeText={(text) => setPosterPath(text)} value={posterPath}  placeholder='Input title'/>
            <TextInput onChangeText={(text) => setPopularity(Number(text))} value={popularity} placeholder='Input title' />
            <TextInput onChangeText={(text) => setTags(text)} value={tags} />
            <Button title="submit" onPress={() => addMovie({
                variables: {title, overview, posterPath, popularity, tags}
            })} style={{width:80}}>
                <Text style={{textAlign:'center'}}>Add Movie</Text>
            </Button> 
            {/* <Text>{JSON.stringify(data)}</Text> */}
        </View>
        
    )
}