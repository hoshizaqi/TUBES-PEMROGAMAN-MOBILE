import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

import axios from 'axios';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [browseCategories, setBrowseCategories] = useState([]);

  const profile = async () => {
    const profile = await AsyncStorage.getItem('profile_image');

    setProfileImage(profile);
  };
  useEffect(() => {
    profile();
  }, []);

  const getBrowseCategories = async () => {
    try {
      const data = await axios.get('http://192.168.1.4:3050/browsecategories');
      console.log('dataBrowseCategories: ', data.data);
      setBrowseCategories(data.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getBrowseCategories();
  }, []);

  const renderItem = ({ item }) => {
    const color = getRandomColor();
    return (
      <Pressable
        onPress={() => navigation.navigate('BrowseDetail')}
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          marginVertical: 8,
          borderRadius: 4,
          elevation: 3,
        }}
      >
        <View style={[styles.box, { backgroundColor: color }]}>
          <Text style={styles.title}>{item.name}</Text>
          <Image source={{ uri: item.icons[0].url }} style={styles.image} />
        </View>
      </Pressable>
    );
  };

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
                fontSize: 23,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              Cari
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('Searched')}
            style={{
              marginHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <Pressable
              onPress={() => navigation.navigate('Searched')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#542C61',
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 50,
              }}
            >
              <AntDesign name="search1" size={20} color="white" />
              <Text style={{ fontWeight: '500', color: 'white', marginLeft: 20 }}>Apa yang ingin kamu dengarkan?</Text>
            </Pressable>
          </Pressable>

          <Text
            style={{
              color: 'white',
              fontSize: 19,
              fontWeight: 'bold',
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            Browse Semua
          </Text>
          <FlatList data={browseCategories} renderItem={renderItem} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }} />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          ></View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 10,
    // marginBottom: 10,
    borderRadius: 5,
    height: 102,
    width: 185,
  },
  image: {
    width: 70,
    height: 70,
    // resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: '500',
    color: 'white',
  },
});
