import { StyleSheet, Text, View, Pressable, Image, FlatList, Button } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Modal from 'react-native-modals';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Player } from '../PlayerContext';

import axios from 'axios';

const SongItem = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [isLiked, setIsLiked] = useState(false);
  const [ModalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [MyPlaylist, setMyPlaylist] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const id = item.id;
  // console.log('id: ', id);

  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };

  const toggleModal = () => {
    setModalVisible(!ModalVisible);
  };

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

  const checkLikedStatus = async () => {
    try {
      const likedData = await axios.get(`http://192.168.1.4:3050/isliked/${id}`);
      setIsLiked(likedData.data.isLiked.body[0]);
    } catch (error) {
      console.error('Check Liked Error:', error);
    }
  };

  const addToLikedSongs = async () => {
    try {
      await axios.get(`http://192.168.1.4:3050/like/${id}`);
      setIsLiked(true);
    } catch (error) {
      console.error('Add to Liked Songs Error:', error);
    }
  };

  const removeFromLikedSongs = async () => {
    try {
      await axios.get(`http://192.168.1.4:3050/unlike/${id}`);
      setIsLiked(false);
    } catch (error) {
      console.error('Remove from Liked Songs Error:', error);
    }
  };

  useEffect(() => {
    checkLikedStatus();
  }, [id]);

  const addToPlaylist = async () => {
    if (selectedPlaylist) {
      console.log('seleceted:', selectedPlaylist);
      try {
        await axios.post(`http://192.168.1.4:3050/addtoplaylist/${selectedPlaylist}/${id}`);
        // getMyPlaylist();
        toggleModal();
      } catch (error) {
        console.error('Add to Playlist Error:', error);
      }
    }
  };

  const renderPlaylistItem = ({ item }) => (
    <Pressable
      onPress={() => {
        setSelectedPlaylist(item.id);
      }}
      style={{ padding: 8 }}
    >
      <Text style={{ color: selectedPlaylist === item.id ? '#1DB954' : 'white', height: 30, alignSelf: 'center' }}>{item.name}</Text>
    </Pressable>
  );

  const renderPlaylists = () => {
    return <FlatList data={MyPlaylist} keyExtractor={(item) => item.id.toString()} renderItem={renderPlaylistItem} />;
  };

  return (
    <Pressable onPress={handlePress} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
      <Image source={{ uri: item?.images[0]?.url }} style={{ width: 55, height: 55, marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={
            isPlaying
              ? {
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#3FFF00',
                }
              : { fontWeight: 'bold', fontSize: 16, color: 'white' }
          }
        >
          {item?.name}
        </Text>
        <Text style={{ marginTop: 4, color: '#989898', fontSize: 13 }}>{item?.artists ? item?.artists : item?.album}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          marginHorizontal: 10,
        }}
      >
        {isLiked ? <AntDesign name="heart" size={24} color="#1DB954" onPress={removeFromLikedSongs} /> : <AntDesign name="hearto" size={24} color="#1DB954" onPress={addToLikedSongs} />}
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" onPress={toggleModal} />
      </View>
      <Modal animationType="slide" transparent={true} visible={ModalVisible}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 400, width: 300, backgroundColor: '#602B79' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 15, color: 'white' }}>Pilih Playlist</Text>
          {renderPlaylists()}

          <View style={{ flexDirection: 'row', alignContent: 'space-between', gap: 10, marginBottom: 15 }}>
            <Button title="Tambah" onPress={addToPlaylist} />
            <Button title="Batal" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
