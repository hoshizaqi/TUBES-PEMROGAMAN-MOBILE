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
import InfoSongScreen from './screens/SongInfoScreen';

import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      // tabBarOptions={{
      //   activeTintColor: 'white',
      //   inactiveTintColor: 'white',
      //   activeBackgroundColor: '#602B79',
      //   inactiveBackgroundColor: '#602B79',
      // }}
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
          tabBarIcon: ({ focused }) => (focused ? <FontAwesome name="search" size={24} color="white" alt="SearchIcon" /> : <AntDesign name="search1" size={24} color="white" alt="SearchIcon" />),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Library',
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
        <Stack.Screen name="Info" component={InfoSongScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
