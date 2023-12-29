import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const ArtistCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate('ArtistScreen', { id: item?.id, images: item?.images[0].url, name: item?.name })}>
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
    </Pressable>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({});
