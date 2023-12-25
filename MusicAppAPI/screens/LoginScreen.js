import { StyleSheet, Text, View, SafeAreaView, Pressable, Button } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
// import * as AppAuth from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { Buffer } from 'buffer';

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '2721ea18ec0a422cb6089ef19fdce53e',
      scopes: ['user-read-private', 'user-read-email'],
      usePKCE: false,
      redirectUri: 'exp://127.0.0.1:8081',
    },
    discovery
  );

  const fetchToken = async () => {
    const code = await AsyncStorage.getItem('token');
    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'exp://127.0.0.1:8081',
    };
    const header = {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + new Buffer.from('2721ea18ec0a422cb6089ef19fdce53e' + ':' + 'dfcdab42e4a5420588cf325d1afe97ce').toString('base64'),
    };
    const responseToken = await axios.post('https://accounts.spotify.com/api/token', data, { headers: header });
    console.log('response TOken', responseToken.data.access_token);
    await AsyncStorage.setItem('accessToken', responseToken.data.access_token);
    navigation.navigate('Main');
  };

  const fetchMe = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const header = {
      Authorization: 'Bearer ' + accessToken,
    };
    try {
      const responseMe = await axios.get('https://api.spotify.com/v1/me', { headers: header });
      console.log('response Me', responseMe);
    } catch (error) {
      console.log('err response Me', error);
    }
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('response login ', response);
      console.log('accessToken ', code);
      AsyncStorage.setItem('token', code);
      // navigation.navigate('Main');
    }
  }, [response, navigation]);

  const fetchLogin = async () => {
    try {
      const responseLogin = await axios.get('http://192.168.1.4:3050/login');
      const responseCallback = await axios.get('http://192.168.1.4:3050/callback');
      // const response = await axios.get('http://192.168.1.4:3050/recommendations');
      // console.log('response rekomendasi', response);
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
            disabled={!request}
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
          {/* <Button title="Test" onPress={() => fetchToken()}>
            Tes Get Token
          </Button>
          <Button title="Test Me" onPress={() => fetchMe()}>
            Tes Get Me
          </Button>
          <Button title="Test Me" onPress={() => masukHome()}>
            Masuk home
          </Button>
          <Button title="Test Fetch Rekom" onPress={() => fetchRekomendasi()}>
            Fetch Rekom
          </Button> */}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
