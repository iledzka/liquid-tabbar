/**
 * Liquid Tab Bar
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import LiquidTabBar from './LiquidTabBar';
import HomeScreen from './HomeScreen';
import ViewProfileScreen from './ViewProfile';
import {ScreenTransitionAnimationProvider} from './ScreenTransitionAnimationProvider';
import {UserScreen} from './UserScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <ScreenTransitionAnimationProvider>
          <Tab.Navigator
            initialRouteName="Home"
            tabBar={props => <LiquidTabBar {...props} />}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Tab.Screen
              name="Settings"
              options={{headerShown: false}}
              component={ViewProfileScreen}
            />
            <Tab.Screen
              name="Eye"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Tab.Screen
              name="Heart"
              options={{headerShown: false}}
              component={ViewProfileScreen}
            />
            <Tab.Screen name="User" component={UserScreen} />
          </Tab.Navigator>
        </ScreenTransitionAnimationProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
