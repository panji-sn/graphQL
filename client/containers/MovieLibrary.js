import React from 'react'
import { gql } from "apollo-boost"
import {Image, FlatList, ScrollView, View, Alert, Dimensions} from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Spinner } from 'native-base';
import { useQuery, useMutation } from '@apollo/react-hooks'

const { width } = Dimensions.get('window')
const FetchMovieDB = gql`
    {
        Movies {
            _id
            title
            posterPath
            popularity
        }
        TvSeries {
            _id
            title
            posterPath
            popularity
        }
    }
`

const DeleteMovie = gql`
    mutation (
        $_id:String
    ) {
        DeleteMovie (
            _id:$_id
            ) {
                _id
            }
    }
`

export default function MovieLibrary({navigation}) {
    const { loading, error, data} = useQuery(FetchMovieDB)
    const [deleteMovie, result] = useMutation(DeleteMovie, {
        update: (cache, {data:{DeleteMovie} }) => {
            let {Movies, TvSeries} = cache.readQuery({query: FetchMovieDB})
            console.log(Movies, 'data movies')
            let arrTemp = []
            for (let i = 0; i < Movies.length; i++) {
                if (Movies[i]._id !== DeleteMovie._id) arrTemp.push(Movies[i])
            }
            cache.writeQuery({
                query: FetchMovieDB,
                data: {Movies: arrTemp, TvSeries}
            })
        },
        onCompleted: () => {
            Alert.alert('Success', 'Film removed from library', [
                {text: 'oke'}
            ])
        }
    })
    function ItemMovies ({data}) {
        return (
            <View style={{margin:10}}>
          <Card style={{width:300}}>    
            <CardItem>
              <Left>
                  {
                    data.posterPath.length > 15 ?
                    <Thumbnail source={{uri: `${data.posterPath}`}} />
                    :
                    <Thumbnail source={{uri: `https://asset.kompas.com/crops/HRCvAaqhuWV48ZFDCdvBPVfOSho=/35x0:755x480/750x500/data/photo/2017/12/11/3354352461.jpg`}} />
                  }
                <Body>
                    <Text>{data.title}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
                {
                    data.posterPath.length > 15 ?
                    <Image source={{uri: `${data.posterPath}`}} style={{height: 400, width: null, flex: 1}}/>
                    : 
                    <Image source={{uri: `https://asset.kompas.com/crops/HRCvAaqhuWV48ZFDCdvBPVfOSho=/35x0:755x480/750x500/data/photo/2017/12/11/3354352461.jpg`}} style={{height: 400, width: null, flex: 1}}/>
                }
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="star" />
                  <Text>{data.popularity}</Text>
                </Button>
              </Left>
              <Body>
                <Button rounded onPress={() => navigation.navigate('Update', {_id: data._id})}>
                  <Icon active name="chatbubbles" />
                </Button>
              </Body>
              <Right>
              <Button rounded danger onPress={() => deleteMovie({
                  variables: {_id: data._id}
              })}>
                  <Icon active name="delete" type="MaterialCommunityIcons" />
                </Button>
              </Right>
            </CardItem>
          </Card>
          </View>
        )
    }
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
    // <Text>{JSON.stringify(data.Movies)}</Text>
    <Container>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{alignItems:'center'}}>
                <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:10, width:width-10}}>
                    <Text style={{marginLeft:20, fontSize:20}}>Movies</Text>
                    <Button rounded onPress={() => navigation.navigate("CreateFormMovie")} style={{marginRight:20}}>
                        <Icon name="plus" type="AntDesign"  />
                    </Button>
                </View>
                {
                    data.Movies.length > 0 &&
                    <FlatList
                    data={data.Movies}
                    renderItem={({ item }) => <ItemMovies data={item} />}
                    keyExtractor={item => item._id}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    />
                }
            </View>
        </ScrollView>
    </Container>
    )

}