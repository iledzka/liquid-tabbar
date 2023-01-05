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
import {
  useClockValue,
  Canvas,
  Circle,
  Group,
  useComputedValue,
} from '@shopify/react-native-skia';
import HomeScreen from './HomeScreen';

function HeartScreen() {
  return <BezierSlider />;
}

const interval = 3000;

function EyeScreen() {
  const clock = useClockValue();
  const opacity = useComputedValue(() => {
    return (clock.current % interval) / interval;
  }, [clock]);

  return (
    <Canvas style={{flex: 1, backgroundColor: '#fff'}}>
      <Group>
        <Circle r={100} cx={300} cy={300} color="black" opacity={opacity} />
      </Group>
    </Canvas>
  );
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
          <Tab.Screen name="Heart" component={HeartScreen} />
          <Tab.Screen name="Eye" component={EyeScreen} />
          <Tab.Screen name="User" component={UserScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
