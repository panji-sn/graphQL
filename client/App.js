import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './config/Apollo'
import Navigation from './Navigation'
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {Container, Content, Spinner} from 'native-base'

export default function App() {
  const [isReady, setIsReady] = useState(false)

  async function LoadFont () {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    await setIsReady(true)
  }

  LoadFont()

  if (!isReady) {
    return (
      <Container>
        <Content>
            <Spinner color='blue' />
        </Content>
      </Container>
    )
  } else return (
    <ApolloProvider client={client}>
      <StatusBar hidden />
      <Navigation></Navigation>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
