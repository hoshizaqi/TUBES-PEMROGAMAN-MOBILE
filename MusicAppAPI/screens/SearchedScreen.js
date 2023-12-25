import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { BottomModal } from 'react-native-modals';
import { ModalContent } from 'react-native-modals';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import axios from 'axios';

import { Player } from '../PlayerContext';
import SongItem from '../components/SongItem';

const SearchedScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const value = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`http://192.168.1.4:3050/search?q=${input}`);
        console.log('dataSearch: ', data.data);
        setResults(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Search Error:', error);
        setLoading(false);
      }
    };

    if (input.trim() !== '') {
      fetchData();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [input]);

  const playTrack = async () => {
    if (results.length > 0) {
      setCurrentTrack(results[0]);
    }
    await play(results[0]);
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

  const handleInputChange = (text) => {
    setInput(text);
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
    if (value.current < results.length) {
      const nextTrack = results[value.current];
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
    if (value.current < results.length) {
      const nextTrack = results[value.current];
      setCurrentTrack(nextTrack);

      await play(nextTrack);
    } else {
      console.log('end of playlist');
    }
  };

  return (
    <>
      <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 50 }}>
          <SafeAreaView>
            <Pressable
              style={{
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#542C61',
                  padding: 5,
                  flex: 1,
                  borderRadius: 3,
                  height: 50,
                }}
              >
                <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <TextInput value={input} onChangeText={(text) => handleInputChange(text)} placeholder="Apa yang ingin kamu dengarkan? " placeholderTextColor={'white'} style={{ fontWeight: '500', color: 'white' }} />
                {/* <Text style={{ fontWeight: '500', color: 'white', marginLeft: 20 }}>Apa yang ingin kamu dengarkan?</Text> */}
              </Pressable>
            </Pressable>
            <View style={{ height: 10 }} />
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            ) : (
              <FlatList showsVerticalScrollIndicator={false} data={results} renderItem={({ item }) => <SongItem item={item} onPress={play} isPlaying={item === currentTrack} />} />
            )}
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
      {currentTrack && (
        <Pressable
          onPress={() => {
            console.log('modalVisible before toggle: ', modalVisible);
            setModalVisible((prevModalVisible) => {
              console.log('prevModalVisible: ', prevModalVisible);
              return !prevModalVisible;
            });
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
            bottom: 10,
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

export default SearchedScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
