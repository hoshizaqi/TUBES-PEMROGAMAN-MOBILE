import React from 'react';

const RecentlyPlayed = ({ item }) => {
  return (
    <Pressable
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: '#542C61',
        borderRadius: 4,
        elevation: 3,
      }}
    >
      <Image style={{ height: 55, width: 55 }} source={{ uri: item.album_images[0].url }} />
      <View style={{ flex: 1, marginHorizontal: 8, justifyContent: 'center' }}>
        <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: 'bold', color: 'white' }}>
          {item.track_name}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentlyPlayed;
