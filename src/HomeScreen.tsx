import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 200,
      }}>
      <Text>Workout</Text>
      <View style={{}}>
        <Text>Athena</Text>
      </View>
    </SafeAreaView>
  );
}
