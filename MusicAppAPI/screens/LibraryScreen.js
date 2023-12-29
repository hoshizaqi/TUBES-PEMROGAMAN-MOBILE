import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, FlatList, Button, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modals';

import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';

const LibraryScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [ModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [id, setId] = useState('');

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
      <Pressable onPress={() => navigation.navigate('AlbumDetail', { id: item.id, images: item?.images[0]?.url, name: item.name, totalTracks: item.total_tracks, owner: item.owner })}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Image source={{ uri: item?.images[0]?.url }} style={{ width: 70, height: 70, marginRight: 10 }} />

          <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>{item.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '400' }}>Playlist - {item.owner}</Text>
              <Ionicons name="ios-trash-bin" size={24} color="#1DB954" onPress={() => deletePlaylist(item.id)} />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const toggleModal = () => {
    setModalVisible(!ModalVisible);
  };

  const addPlaylists = () => {
    toggleModal();
  };

  const renderModalContent = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 200, width: 270, backgroundColor: '#602B79' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: 'white' }}>Buat Playlist Baru</Text>
      <TextInput
        placeholder="Masukkan Nama Playlist"
        value={playlistName}
        onChangeText={(text) => setPlaylistName(text)}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          width: 200,
          backgroundColor: 'white',
          color: 'black', //
        }}
      />
      <View style={{ flexDirection: 'row', alignContent: 'space-between', gap: 10 }}>
        <Button title="Buat Playlist" onPress={createPlaylist} />
        <Button title="Batal" onPress={toggleModal} />
      </View>
    </View>
  );

  const createPlaylist = async () => {
    try {
      const response = await axios.post('http://192.168.1.4:3050/createplaylist', {
        playlistName: playlistName,
      });

      console.log('New playlist created:', response.data);
      Alert.alert('Sukses', 'Playlist telah berhasil dibuat!');

      toggleModal();

      getMyPaylist();
    } catch (err) {
      Alert.alert('Error', 'Terjadi kesalahan saat membuat playlist.');
      console.error('Error creating playlist:', err.message);
    }
  };

  const deletePlaylist = (playlistId) => {
    setId(playlistId);
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus playlist ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => confirmDeletePlaylist(),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDeletePlaylist = async () => {
    try {
      // Kirim request delete ke backend
      const response = await fetch(`http://192.168.1.4:3050/deleteplaylist/${id}`, {
        method: 'DELETE',
      });

      // Periksa status response
      if (response.ok) {
        // Playlist dihapus berhasil
        Alert.alert('Sukses', 'Playlist berhasil dihapus');
        getMyPaylist(); // Refresh daftar playlist setelah menghapus
      } else {
        // Terjadi kesalahan saat menghapus playlist
        const errorMessage = await response.text();
        Alert.alert('Error', `Gagal menghapus playlist. ${errorMessage}`);
      }
    } catch (error) {
      console.error('Delete Playlist Error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus playlist');
    }
  };

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
            <Pressable style={{ marginRight: 10 }} onPress={addPlaylists}>
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
          <Modal animationType="slide" transparent={true} visible={ModalVisible} onRequestClose={toggleModal}>
            {renderModalContent()}
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default LibraryScreen;
