import React from 'react'
import { gql } from "apollo-boost"
import {Image, FlatList, ScrollView, View} from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Spinner } from 'native-base';
import { useQuery } from '@apollo/react-hooks'

const FetchMovies = gql`
    {
        GetMovies {
          title
          vote_average
          poster_path
          id
          vote_count
        }

        GetTvSeries {
          name
          vote_average
          poster_path
          id
          vote_count
        }
    }
`

export default function Home ({navigation}) {
    const { loading, error, data } = useQuery(FetchMovies);
    function Item ({data}) {
        return (
            <View style={{margin:10}}>
          <Card style={{width:300}}>    
            <CardItem>
              <Left>
                <Thumbnail source={{uri: `http://image.tmdb.org/t/p/w500/${data.poster_path}`}} />
                <Body>
                  {
                    data.title ?
                    <Text>{data.title}</Text>
                    :
                    <Text>{data.name}</Text>
                  }
                  {/* <Text note>GeekyAnts</Text> */}
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: `http://image.tmdb.org/t/p/w500/${data.poster_path}`}} style={{height: 400, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="star" />
                  <Text>{data.vote_average} Rating</Text>
                </Button>
              </Left>
              <Body>
                {/* <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button> */}
              </Body>
              <Right>
                {
                  data.title ?
                  <Button onPress={() => navigation.navigate('DetailMovie', {id: data.id})} rounded>
                    <Text style={{fontSize:10}}>Details</Text>
                  </Button>
                  :
                  <Button onPress={() => navigation.navigate('DetailTvSerie', {id: data.id})} rounded>
                    <Text style={{fontSize:10}}>Details</Text>
                  </Button>
                }
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
    // <Text>{JSON.stringify(data.GetMovies)}</Text>
        <Container>
        <Header>
          <Text style={{color: 'white', fontSize: 28}}>What's your mood today ?</Text>    
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{marginLeft:20, fontSize:20}}>Popular Movies</Text>
        {
            data.GetMovies.length > 0 &&
            <FlatList
            data={data.GetMovies}
            renderItem={({ item }) => <Item data={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            />
        }
        <Text style={{marginLeft:20, fontSize:20}}>Popolar Tv Series</Text>
        {
            data.GetTvSeries.length > 0 &&
            <FlatList
            data={data.GetTvSeries}
            renderItem={({ item }) => <Item data={item} />}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            />
        }
        </ScrollView>
        </Container>
    )
}