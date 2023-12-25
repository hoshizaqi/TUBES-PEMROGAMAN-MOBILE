import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const RecomenSongs = ({ item }) => {
  return (
    <View style={{ margin: 10, alignItems: 'center' }}>
      <Image style={{ width: 125, height: 125, borderRadius: 5 }} source={{ uri: item.images[0].url }} />
      <Text
        style={{
          fontSize: 13,
          fontWeight: '500',
          color: 'white',
          marginTop: 10,
        }}
      >
        {item?.name}
      </Text>
    </View>
  );
};

export default RecomenSongs;

const styles = StyleSheet.create({});
