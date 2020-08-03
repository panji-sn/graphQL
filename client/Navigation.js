import React from 'react'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation-tabs'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import Home from './containers/Home'
import DetailMovie from './containers/DetailMovie'
import DetailTvSerie from './containers/DetailTvSerie'
import MovieLibrary from './containers/MovieLibrary'
import UpdateFormMovie from './containers/UpdateFormMovie'
import CreateFormMovie from './containers/CreateFormMovie'
import UpdateFormTv from './containers/UpdateFormTv'
import CreateFormTv from './containers/CreateFormTv'
import TvLibrary from './containers/TvLibrary'

const StackStart = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: () => ({
            header: null
        })
    },
    DetailMovie: {
        screen: DetailMovie,
        navigationOptions: () => ({
            headerTitle: 'Details',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    },
    DetailTvSerie: {
        screen: DetailTvSerie,
        navigationOptions: () => ({
            headerTitle: 'Details',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    }
}, {
    initialRouteName: 'Home'
})

const movieLibrary = createStackNavigator({
    Movie: {
        screen: MovieLibrary,
        navigationOptions: () => ({
            header: null
        })
    },
    Update: {
        screen: UpdateFormMovie,
        navigationOptions: () => ({
            headerTitle: 'Update',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    },
    CreateFormMovie: {
        screen: CreateFormMovie,
        navigationOptions: () => ({
            headerTitle: 'Create',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    }
})

const tvLibrary = createStackNavigator({
    TV: {
        screen: TvLibrary,
        navigationOptions: () => ({
            header: null
        })
    },
    Update: {
        screen: UpdateFormTv,
        navigationOptions: () => ({
            headerTitle: 'Update',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    },
    CreateFormTv: {
        screen: CreateFormTv,
        navigationOptions: () => ({
            headerTitle: 'Create',
            headerStyle: {
                backgroundColor: 'rgb(63, 81, 181)'
            },
            headerTintColor: 'white'
        })
    }
})

const tapNavigation = createMaterialTopTabNavigator({
    Movie: {
        screen: movieLibrary,
        navigationOptions: () => ({
            tabBarIcon: <MaterialCommunityIcons name="home" size={32}></MaterialCommunityIcons>,
            
        })
    },
    TV: {
        screen: tvLibrary,
        navigationOptions: () => ({
            tabBarIcon: <MaterialCommunityIcons name="home" size={32}></MaterialCommunityIcons>,
            
        })
    }
}, {
    tabBarOptions: {
        tabStyle: {
            backgroundColor: 'rgb(63, 81, 181)'
        }
    }
})

const Start = createBottomTabNavigator({
    Home: {
        screen: StackStart,
        navigationOptions: () => ({
            tabBarIcon: <MaterialCommunityIcons name="home" size={32}></MaterialCommunityIcons>,
            
        })
    },
    Library: {
        screen: tapNavigation,
        navigationOptions: () => ({
            tabBarIcon: <MaterialCommunityIcons name="library-movie" size={32}></MaterialCommunityIcons>
        })
    }
}, {
    tabBarOptions: {
        labelStyle: {
            fontSize: 12,
            color: 'white'
        },
        activeBackgroundColor: 'rgba(63, 81, 181, 1)',
        inactiveBackgroundColor: 'rgba(63, 81, 181, 0.8)'
    },
}
)

export default createAppContainer(Start)