import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, TextInput } from 'react-native';
import { HStack } from '@gluestack-ui/themed';
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

const data = [
  { id: '1', title: 'All', subtitle: 'Search song, artist, album, etc...' },
  { id: '2', title: 'Songs', subtitle: 'Those Eyes New west All I want Kodaline' },
  { id: '3', title: 'Album', subtitle: 'All I want' },
  { id: '4', title: 'Artists', subtitle: 'Those Eyes New west' },
  { id: '5', title: 'Album Artist', subtitle: 'All I want' },
  // dan seterusnya untuk semua judul lagu
];

const Item = ({ title, subtitle }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const SearchScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState(null);

  const profile = async () => {
    const profile = await AsyncStorage.getItem('profile_image');
    const msg = await AsyncStorage.getItem('currentTime');

    setProfileImage(profile);
    setMessage(msg);
  };
  useEffect(() => {
    // Panggil fungsi profile saat komponen dimount
    profile();
  }, []);

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
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
              source={{ uri: profileImage }}
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

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 9,
            }}
          >
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#542C61',
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38,
              }}
            >
              <AntDesign name="search1" size={20} color="white" />
              <Text style={{ fontWeight: '500', color: 'white', marginLeft: 20 }}>Apa yang ingin kamu dengarkan?</Text>
            </Pressable>
          </Pressable>
          <View
            style={{
              marginTop: 10,
              marginHorizontal: 12,
              marginVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'center',
            }}
          >
            <Pressable
              style={{
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 15, color: 'white' }}>Semua</Text>
            </Pressable>

            <Pressable
              style={{
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 15, color: 'white' }}>Album</Text>
            </Pressable>

            <Pressable
              style={{
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 15, color: 'white' }}>Artist</Text>
            </Pressable>

            <Pressable
              style={{
                padding: 20,
              }}
            >
              <Text style={{ fontSize: 15, color: 'white' }}>Musik</Text>
            </Pressable>
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 19,
              fontWeight: 'bold',
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            Artist
          </Text>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                marginBottom: 10,
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                flex: 1,
                marginHorizontal: 10,
                marginVertical: 8,

                borderRadius: 4,
                elevation: 3,
              }}
            >
              <Image style={{ width: 120, height: 120 }} source={{ uri: 'https://i.scdn.co/image/ab6761610000517404df1f5b551614aff7882b2f' }} />
              <View style={styles.randomArtist}>
                <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>MY FIRST STORY</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
