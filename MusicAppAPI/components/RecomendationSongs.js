import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useContext } from 'react';
import { Player } from '../PlayerContext';

const RecomenSongs = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };
  return (
    <Pressable onPress={handlePress}>
      <View style={{ margin: 10, alignItems: 'center' }}>
        <Image style={{ width: 125, height: 125, borderRadius: 5 }} source={{ uri: item.images[0].url }} />
        <Text
          style={
            isPlaying
              ? {
                  fontWeight: '500',
                  fontSize: 13,
                  color: '#3FFF00',
                  marginTop: 10,
                }
              : {
                  fontSize: 13,
                  fontWeight: '500',
                  color: 'white',
                  marginTop: 10,
                }
          }
        >
          {item?.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecomenSongs;

const styles = StyleSheet.create({});
