import { Image, ScrollView, Pressable, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = () => {
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const data = await axios.get('http://192.168.1.4:3050/profile');
      console.log('dataProfile: ', data.data);
      setUserProfile(data.data);
      setLoading(false);
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

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1 }}>
      <SafeAreaView>
        <Pressable onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <ScrollView style={{ marginTop: 50 }}>
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    resizeMode: 'cover',
                  }}
                  source={{ uri: userProfile?.images[0].url }}
                />
                <View>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{userProfile?.display_name}</Text>
                  <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>{userProfile?.email}</Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '500',
                marginHorizontal: 12,
              }}
            >
              Your Playlists
            </Text>
            {/* <View style={{ padding: 15 }}>
              {playlists.map((item, index) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 }}>
                  <Image
                    source={{
                      uri: item?.images[0]?.url || 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800',
                    }}
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                  <View>
                    <Text style={{ color: 'white' }}>{item?.name}</Text>
                    <Text style={{ color: 'white', marginTop: 7 }}>0 followers</Text>
                  </View>
                </View>
              ))}
            </View> */}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;
