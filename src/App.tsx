/**
 * Liquid Tab Bar
 *
 * @format
 */

import React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import LiquidTabBar from './LiquidTabBar';
import {SettingsScreen} from './SettingsScreen';
import {BezierSlider} from './bezierSlider';
import HomeScreen from './HomeScreen';
import ViewProfileScreen from './ViewProfile';

function HeartScreen() {
  return <BezierSlider />;
}

function UserScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Text>User!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          tabBar={props => <LiquidTabBar {...props} />}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen
            name="Eye"
            component={ViewProfileScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen name="Heart" component={HeartScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
