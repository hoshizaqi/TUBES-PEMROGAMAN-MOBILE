import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useContext } from 'react';
import { Player } from '../PlayerContext';

const SongItem = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
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
        <Text style={{ marginTop: 4, color: '#989898', fontSize: 13 }}>{item?.artists}</Text>
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
