import React, {useState} from 'react'
import { TextInput, View, Dimensions, Alert} from 'react-native'
import {Text, Button} from 'native-base'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from "apollo-boost"
const { width } = Dimensions.get('window')

const UpdateTv = gql`
    mutation (
        $title:String,
        $overview:String,
        $posterPath:String,
        $popularity:Float,
        $tags:[String],
        $_id:String
    ) {
        UpdateTvSerie (
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

const FetchTvDatabase = gql`
    query ($_id:String){
        TvSerie(_id:$_id) {
            title
            popularity
            posterPath
            overview
            _id
            tags
        }
    }
`

export default function UpdateFormTv ({navigation}) {
    const [title, setTitle] = useState('')
    const [overview, setOverview] = useState('')
    const [posterPath, setPosterPath] = useState('')
    const [popularity, setPopularity] = useState(0.0)
    const [tags, setTags] = useState([''])
    const {data, error, loading} = useQuery(FetchTvDatabase, {
        variables: {_id:navigation.state.params._id},
        onCompleted: async () => {
            await setTitle(data.TvSerie.title)
            await setPosterPath(data.TvSerie.posterPath)
            await setOverview(data.TvSerie.overview)
            await setPopularity(String(data.TvSerie.popularity))
            await setTags(data.TvSerie.tags.join(','))
        }
    })
    const [updateTv, result] = useMutation(UpdateTv, {
        onCompleted: () => {
            Alert.alert('Success', 'Tv Serie Updated', [
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
            <Button title="submit" onPress={() => updateTv({
                variables: {title, overview, posterPath, popularity:Number(popularity), tags:tags.split(','), _id:data.TvSerie._id}
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