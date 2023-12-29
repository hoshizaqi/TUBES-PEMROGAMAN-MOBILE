import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { BottomModal } from 'react-native-modals';
import { ModalContent } from 'react-native-modals';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import axios from 'axios';

import ArtistCard from '../components/ArtistCard';
import RecomenSongs from '../components/RecomendationSongs';
import { Player } from '../PlayerContext';
import SongItem from '../components/SongItem';

const HomeScreen = () => {
  const colors = ['#27374D', '#1D267D', '#BE5A83', '#212A3E', '#917FB3', '#37306B', '#443C68', '#5B8FB9', '#144272'];
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recomenSongs, setRecomenSongs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
      const data = await axios.get('http://192.168.1.4:3050/profile');
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
      const data = await axios.get('http://192.168.1.4:3050/recentlyplayed');
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
        <Image style={{ height: 60, width: 60 }} source={{ uri: item.album_images[0].url }} />
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
      const data = await axios.get('http://192.168.1.4:3050/mytopartists');
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
      const data = await axios.get('http://192.168.1.4:3050/recommendations');
      console.log('dataRecomSongs: ', data.data);
      setRecomenSongs(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getRecomenSongs();
  }, []);

  const playTrack = async () => {
    if (recomenSongs.length > 0) {
      setCurrentTrack(recomenSongs[0]);
    }
    await play(recomenSongs[0]);
  };

  const play = async (nextTrack) => {
    console.log('Next Track: ', nextTrack);
    const uri = nextTrack?.preview;
    console.log('Next Track uri: ', uri);
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: uri,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      onPlaybackStatusUpdate(status);
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (err) {
      console.log('error play: ', err.message);
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    console.log('Playback status: ', status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      console.log('progresss: ', progress);
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const circleSize = 12;
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const extractColors = async () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    setBackgroundColor(randomColor);
  };

  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < recomenSongs.length) {
      const nextTrack = recomenSongs[value.current];
      setCurrentTrack(nextTrack);
      extractColors();
      await play(nextTrack);
    } else {
      console.log('end of playlist');
    }
  };

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < recomenSongs.length) {
      const nextTrack = recomenSongs[value.current];
      setCurrentTrack(nextTrack);

      await play(nextTrack);
    } else {
      console.log('end of playlist');
    }
  };

  return (
    <>
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
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {message}
                </Text>
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
                  <RecomenSongs item={item} key={index} onPress={play} isPlaying={item === currentTrack} />
                ))}
              </ScrollView>

              <View style={{ height: 10 }} />
            </SafeAreaView>
          </ScrollView>
        )}
      </LinearGradient>
      {currentTrack && (
        <Pressable
          onPress={() => {
            console.log('modalVisiblecurent: ', modalVisible);
            setModalVisible(!modalVisible);
          }}
          style={{
            backgroundColor: '#3B0D51',
            width: '90%',
            padding: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 15,
            position: 'absolute',
            borderRadius: 6,
            left: 20,
            bottom: 40,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image style={{ width: 40, height: 40 }} source={{ uri: currentTrack?.images[0].url }} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {currentTrack?.name} - {currentTrack?.artists}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable onPress={handlePlayPause}>{isPlaying ? <AntDesign name="pausecircle" size={24} color="white" /> : <AntDesign name="play" size={24} color="white" onPress={handlePlayPause} />}</Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal visible={modalVisible} onHardwareBackPress={() => setModalVisible(false)} swipeDirection={['up', 'down']} swipeThreshold={200}>
        <ModalContent style={{ height: '100%', width: '100%', backgroundColor: '#3B0D51' }}>
          <View style={{ height: '100%', width: '100%', marginTop: 40 }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <AntDesign onPress={() => setModalVisible(!modalVisible)} name="down" size={24} color="white" />

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{currentTrack?.name}</Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            <View style={{ height: 70 }} />

            <View style={{ padding: 10 }}>
              <Image style={{ width: '100%', height: 330, borderRadius: 4 }} source={{ uri: currentTrack?.images[0].url }} />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{currentTrack?.name}</Text>
                  <Text style={{ color: '#D3D3D3', marginTop: 4 }}>{currentTrack?.artists}</Text>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    width: '100%',
                    marginTop: 10,
                    height: 3,
                    backgroundColor: 'gray',
                    borderRadius: 5,
                  }}
                >
                  <View style={[styles.progressbar, { width: `${progress * 100}%` }]} />
                  <View
                    style={[
                      {
                        position: 'absolute',
                        top: -5,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: 'white',
                      },
                      {
                        left: `${progress * 100}%`,
                        marginLeft: -circleSize / 2,
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 15, color: '#D3D3D3' }}>{formatTime(currentTime)}</Text>

                  <Text style={{ color: 'white', fontSize: 15, color: '#D3D3D3' }}>{formatTime(totalDuration)}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: 17,
                }}
              >
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={handlePlayPause}>{isPlaying ? <AntDesign name="pausecircle" size={60} color="white" /> : <AntDesign name="play" size={60} color="white" onPress={handlePlayPause} />}</Pressable>
                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
