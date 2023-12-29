import React from 'react';
import { View, Text, Image } from '@gluestack-ui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import SearchScreen from './screens/SearchScreen';
import LikedSongScreen from './screens/SongLikedScreen';
import SongInfoScreen from './screens/SongInfoScreen';
import SongLikedScreen from './screens/SongLikedScreen';
import SearchedScreen from './screens/SearchedScreen';
import AlbumDetail from './screens/AlbumDetail';
import BrowseDetail from './screens/BrowseDetail';
import ArtistScreen from './screens/ArtistScreen';
import Profile from './screens/Profile';

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#602B79',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowOpacity: 4,
          shadowRadius: 4,
          elevation: 4,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarLabelStyle: { color: 'white' },
          tabBarIcon: ({ focused }) => (focused ? <Entypo name="home" size={24} color="white" alt="HomeIcon" /> : <AntDesign name="home" size={24} color="white" alt="HomeIcon" />),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarLabelStyle: { color: 'white' },
          tabBarIcon: ({ focused }) => (focused ? <FontAwesome name="search" size={24} color="white" alt="SearchIcon" /> : <AntDesign name="search1" size={24} color="white" alt="SearchIcon" />),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Library',
          tabBarLabelStyle: { color: 'white' },
          tabBarIcon: ({ focused }) => (focused ? <Ionicons name="ios-list-circle" size={24} color="white" alt="LibraryIcon" /> : <Ionicons name="ios-list-circle-outline" size={24} color="white" alt="LibraryIcon" />),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Liked" component={LikedSongScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Info" component={SongInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SongLiked" component={SongLikedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Searched" component={SearchedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlbumDetail" component={AlbumDetail} options={{ headerShown: false }} />
        <Stack.Screen name="ArtistScreen" component={ArtistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BrowseDetail" component={BrowseDetail} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
