import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Map from './Map';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({

});
