import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, Button, ActivityIndicator } from 'react-native';
import { HStack } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
// import ArtistCard from '../components/ArtistCard';
// import RecentlyPlayedCard from '../components/RecentlyPlayedCard';
import { useNavigation } from '@react-navigation/native';
import SearchScreen from './SearchScreen';
import LibraryScreen from './LibraryScreen';
import ArtistCard from '../components/ArtistCard';
import RecomenSongs from '../components/RecomendationSongs';

const HomeScreen = () => {
  const navigation = useNavigation;
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recomenSongs, setRecomenSongs] = useState([]);

  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return 'Selamat Pagi';
    } else if (currentTime < 16) {
      return 'Selamat Siang';
    } else if (currentTime < 22) {
      return 'Selamat Sore';
    } else {
      return 'Selamat Malam';
    }
  };
  const message = greetingMessage();
  const getProfile = async () => {
    try {
      const data = await axios.get('http://10.217.16.130:3050/profile');
      console.log('dataProfile: ', data.data);
      setUserProfile(data.data);
      setLoading(false);
      await AsyncStorage.setItem('profile_image', userProfile?.images[0]?.url);
      await AsyncStorage.setItem('currentTime', greetingMessage());

      return data;
    } catch (err) {
      console.log(err.message);
      console.log(err.response);
      setLoading(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);

  const getRecentlyPlayed = async () => {
    try {
      const data = await axios.get('http://10.217.16.130:3050/recentlyplayed');
      console.log('dataRecentlyPlayed: ', data.data);
      setRecentlyPlayed(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getRecentlyPlayed();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: '#542C61',
          borderRadius: 4,
          elevation: 3,
        }}
      >
        <Image style={{ height: 55, width: 55 }} source={{ uri: item.album_images[0].url }} />
        <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
          <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>
            {item.track_name}
          </Text>
        </View>
      </Pressable>
    );
  };

  const getMyTopArtist = async () => {
    try {
      const data = await axios.get('http://10.217.16.130:3050/mytopartists');
      console.log('dataMyTopArtist: ', data.data);
      setTopArtists(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getMyTopArtist();
  }, []);

  const getRecomenSongs = async () => {
    try {
      const data = await axios.get('http://10.217.16.130:3050/recommendations');
      console.log('dataRecomSongs: ', data.data);
      setRecomenSongs(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getRecomenSongs();
  }, []);

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <ScrollView style={{ marginTop: 50 }}>
          <SafeAreaView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: 'cover',
                  marginLeft: 10,
                }}
                source={{ uri: userProfile?.images[0]?.url }}
                alt="Profile"
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {message}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                marginHorizontal: 12,
                marginVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Pressable
                style={{
                  backgroundColor: '#542C61',
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <Text style={{ fontSize: 15, color: 'white' }}>Semua</Text>
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: '#542C61',
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <Text style={{ fontSize: 15, color: 'white' }}>Musik</Text>
              </Pressable>

              <Pressable
                style={{
                  backgroundColor: '#542C61',
                  padding: 10,
                  borderRadius: 30,
                }}
              >
                <Text style={{ fontSize: 15, color: 'white' }}>Podcasts</Text>
              </Pressable>
            </View>

            <View style={{ height: 10 }} />

            <Text
              style={{
                color: 'white',
                fontSize: 19,
                fontWeight: 'bold',
                marginHorizontal: 10,
                marginTop: 10,
              }}
            >
              Terakhir Kali Diputar
            </Text>
            <FlatList data={recentlyplayed} renderItem={renderItem} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }} />
            <Text
              style={{
                color: 'white',
                fontSize: 19,
                fontWeight: 'bold',
                marginHorizontal: 10,
                marginTop: 10,
              }}
            >
              Artist Teratas
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topArtists.map((item, index) => (
                <ArtistCard item={item} key={index} />
              ))}
            </ScrollView>
            <Text
              style={{
                color: 'white',
                fontSize: 19,
                fontWeight: 'bold',
                marginHorizontal: 10,
                marginTop: 10,
              }}
            >
              Lagu Rekomendasi
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recomenSongs.map((item, index) => (
                <RecomenSongs item={item} key={index} />
              ))}
            </ScrollView>

            <View style={{ height: 10 }} />
          </SafeAreaView>
        </ScrollView>
      )}
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
