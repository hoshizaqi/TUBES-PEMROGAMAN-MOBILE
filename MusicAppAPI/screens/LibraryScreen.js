import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList } from 'react-native';
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

const LibraryScreen = () => {
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
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default LibraryScreen;
