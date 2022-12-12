/**
 * Liquid Tab Bar
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/Feather';
import LiquidTabBar from './LiquidTabBar';
import {SettingsScreen} from './SettingsScreen';
import {BezierSlider} from './bezierSlider';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
}

// function SettingsScreen() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Settings!</Text>
//     </View>
//   );
// }

function HeartScreen() {
  return <BezierSlider />;
}

function UserScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
          tabBar={props => <LiquidTabBar {...props} />}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              if (route.name === 'Home') {
                return <Icon name="home" size={size} color={color} />;
              } else if (route.name === 'Settings') {
                return <Icon name="bookmark" size={size} color={color} />;
              } else if (route.name === 'Heart') {
                return <Icon name="heart" size={size} color={color} />;
              } else if (route.name === 'User') {
                return (
                  <Icon
                    name="user"
                    strokeWidth={20}
                    size={size}
                    color={color}
                  />
                );
              }
            },
            tabBarActiveTintColor: '#003153',
            tabBarInactiveTintColor: '#b2beb5',
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Heart" component={HeartScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
