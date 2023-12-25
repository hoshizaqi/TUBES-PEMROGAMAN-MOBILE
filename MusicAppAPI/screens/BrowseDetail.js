import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, TextInput, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
// import ArtistCard from '../components/ArtistCard';
// import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';

const BrowseDetail = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <SafeAreaView>
          <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          {/* <View style={{ marginHorizontal: 10 }}>
            <Image source={{ uri: images }} style={{ width: 200, height: 200, alignSelf: 'center' }} />
            <View style={{ height: 20 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{name}</Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>{owner}</Text>
            <Text style={{ color: 'white', fontSize: 13, marginTop: 5 }}>{totalTracks} Lagu</Text>
          </View>
          <View style={{ height: 20 }} />
          <FlatList data={songs.tracks} renderItem={renderItem} numColumns={1} keyExtractor={(item) => item.uri} /> */}
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default BrowseDetail;
