import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ModalPortal } from 'react-native-modals';

import StackNavigator from './StackNavigator';
import { PlayerContext } from './PlayerContext';

export default function App() {
  return (
    <>
      <PlayerContext>
        <StackNavigator />
        <ModalPortal />
      </PlayerContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
