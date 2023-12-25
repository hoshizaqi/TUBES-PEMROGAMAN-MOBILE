import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  const profile = async () => {
    const profile = await AsyncStorage.getItem('profile_image');

    setProfileImage(profile);
  };
  useEffect(() => {
    profile();
  }, []);

  const getMyPaylist = async () => {
    try {
      const data = await axios.get('http://192.168.1.4:3050/myplaylists');
      console.log('dataMyPlaylist: ', data.data);
      setMyPlaylist(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getMyPaylist();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate('AlbumDetail', { id: item.id, images: item.images[0].url, name: item.name, totalTracks: item.total_tracks, owner: item.owner })}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image source={{ uri: item.images[0].url }} style={{ width: 70, height: 70, marginRight: 10 }} />

          <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>Playlist - {item.owner}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const getLikedSongs = async () => {
    try {
      const data = await axios.get('http://192.168.1.4:3050/likedsongs');
      console.log('dataLikedsongs: ', data.data);
      setLikedSongs(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getLikedSongs();
  }, []);

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  resizeMode: 'cover',
                  marginLeft: 10,
                }}
                source={{ uri: profileImage }}
                alt="Profile"
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 23,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Koleksi Kamu
              </Text>
            </View>
            <Pressable style={{ marginRight: 10 }}>
              <Ionicons name="ios-add-sharp" size={35} color="white" />
            </Pressable>
          </View>

          <Pressable>
            <View style={{ height: 30 }} />
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <View style={{ marginRight: 10 }}>
                <LinearGradient colors={['#33006F', '#FFFFFF']}>
                  <Pressable
                    onPress={() => navigation.navigate('SongLiked')}
                    style={{
                      width: 70,
                      height: 70,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <AntDesign name="heart" size={24} color="white" />
                  </Pressable>
                </LinearGradient>
              </View>

              <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>Lagu tang Disukai</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>Playlist</Text>
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable>
            <FlatList data={myPlaylist} renderItem={renderItem} numColumns={1} />
          </Pressable>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default LibraryScreen;
