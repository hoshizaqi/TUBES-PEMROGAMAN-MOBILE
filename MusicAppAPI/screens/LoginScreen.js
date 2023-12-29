import { StyleSheet, Text, View, SafeAreaView, Pressable, Button } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { Entypo } from '@expo/vector-icons';
import axios from 'axios';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const fetchLogin = async () => {
    try {
      const responseLogin = await axios.get('http://192.168.1.4:3050/login');
      const responseCallback = await axios.get('http://192.168.1.4:3050/callback');
      navigation.navigate('Main');
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <LinearGradient colors={['#440B57', '#1D181F']} style={{ flex: 1, justifyContent: 'center' }}>
      <SafeAreaView>
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{ height: 80 }} />
          <Entypo style={{ textAlign: 'center' }} name="spotify" size={80} color="white" />
          <Text
            style={{
              color: 'white',
              fontSize: 40,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            Jutaan lagu.
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 40,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Gratis dengan login akun Spotify.
          </Text>

          <View style={{ height: 80 }} />
          <Pressable
            onPress={() => fetchLogin()}
            style={{
              backgroundColor: '#1DB954',
              padding: 10,
              width: 300,
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Text>Login Dengan Akun Spotify</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
