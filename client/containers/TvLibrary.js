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

const DeleteTv = gql`
    mutation (
        $_id:String
    ) {
        DeleteTvSerie (
            _id:$_id
            ) {
                _id
            }
    }
`


export default function TvLibrary({navigation}) {
    const { loading, error, data} = useQuery(FetchMovieDB)
    const [deleteTv, resultTv] = useMutation(DeleteTv, {
        update: (cache, {data:{DeleteTvSerie} }) => {
            let {TvSeries, Movies} = cache.readQuery({query: FetchMovieDB})
            console.log(TvSeries, 'data TvSeries')
            let arrTemp = []
            for (let i = 0; i < TvSeries.length; i++) {
                if (TvSeries[i]._id !== DeleteTvSerie._id) arrTemp.push(TvSeries[i])
            }
            cache.writeQuery({
                query: FetchMovieDB,
                data: {TvSeries: arrTemp, Movies}
            })
        },
        onCompleted: () => {
            Alert.alert('Success', 'Tv Serie removed from library', [
                {text: 'oke'}
            ])
        }
    })

    function ItemTv ({data}) {
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
              <Button rounded danger onPress={() => deleteTv({
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
        <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{alignItems:'center'}}>
                <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:10, width:width-10}}>
                    <Text style={{marginLeft:20, fontSize:20}}>Tv Series</Text>
                    <Button rounded style={{marginRight:20}}
                    onPress={() => navigation.navigate("CreateFormTv")}
                    >
                        <Icon name="plus" type="AntDesign"  />
                    </Button>
                </View>
                {
                    data.TvSeries.length > 0 &&
                    <FlatList
                    data={data.TvSeries}
                    renderItem={({ item }) => <ItemTv data={item} />}
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