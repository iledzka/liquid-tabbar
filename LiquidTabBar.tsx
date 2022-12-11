import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {TapGestureHandler} from 'react-native-gesture-handler';

function LiquidCircleButtom({route, index, state, descriptors, navigation}) {
  const pressed = useSharedValue(false);
  const y = useSharedValue(0);
  const opacity = useSharedValue(1);
  const uas = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: withSpring(pressed.value ? 0.4 : 1)},
        {translateY: y.value}, //withSpring(pressed.value ? -100 : 0)},
      ],
      opacity: opacity.value,
      // backgroundColor: withTiming(pressed.value ? 'red' : 'translucent', {
      //   duration: 600,
      //   easing: Easing.linear,
      // }),
    };
  });
  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({name: route.name, merge: true});
    }
  };
  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      console.log('onStart', event);
      pressed.value = true;
      y.value = withSequence(
        withSpring(-100, {mass: 0.1}),
        withSpring(0, {mass: 0.1, stiffness: 200}),
      );
      opacity.value = withSequence(
        withSpring(0),
        withSpring(1, {mass: 0.1, stiffness: 200}),
      );
    },
    onEnd: (event, ctx) => {
      console.log('onEnd', event);
      pressed.value = false;
    },
    onCancel: (event, ctx) => {
      console.log('onCancel', event);
      pressed.value = false;
    },
    onActive: (event, ctx) => {
      console.log('onActive', event);
      runOnJS(onPress)();
    },
    onFail: (event, ctx) => {
      console.log('onFail', event);
      pressed.value = false;
    },
    onFinish: (event, ctx) => {
      console.log('onFinish', event);
      pressed.value = false;
    },
  });
  const {options} = descriptors[route?.key];

  const isFocused = state.index === index;

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const onPressOut = () => {
    // translateY.value = withTiming(0);
  };

  return (
    <TapGestureHandler onGestureEvent={eventHandler}>
      <Animated.View
        accessibilityRole="button"
        accessibilityState={isFocused ? {selected: true} : {}}
        style={[
          {
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: 1,
            width: 50,
            backgroundColor: 'pink',
          },
          uas,
        ]}>
        {options.tabBarIcon({
          focused: isFocused,
          color: isFocused
            ? options.tabBarActiveTintColor
            : options.tabBarInactiveTintColor,
          size: 30,
        })}
      </Animated.View>
    </TapGestureHandler>
  );
}
export default function MyTabBar({state, descriptors, navigation}) {
  const pressed = useSharedValue(false);
  const uas = useAnimatedStyle(() => {
    return {
      // backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      marginHorizontal: withSpring(pressed.value ? 20 : 0),
      paddingTop: withSpring(pressed.value ? 36 : 20),
      // backgroundColor: withTiming(pressed.value ? 'red' : 'translucent', {
      //   duration: 600,
      //   easing: Easing.cubic,
      // }),
    };
  });

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      console.log('onActive', event);
      pressed.value = true;
    },
    onEnd: (event, ctx) => {
      console.log('onActive', event);
      pressed.value = false;
    },
    onCancel: (event, ctx) => {
      console.log('onActive', event);
      pressed.value = false;
    },
    onActive: (event, ctx) => {
      console.log('onActive', event);
    },
    onFail: (event, ctx) => {
      console.log('onFail', event);
      pressed.value = false;
    },
    onFinish: (event, ctx) => {
      console.log('onFinish', event);
      pressed.value = false;
    },
  });
  return (
    <TapGestureHandler onGestureEvent={eventHandler}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: 20,
            paddingBottom: 6,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: 'pink',
          },
          uas,
        ]}>
        {state.routes.map((route, index) => {
          console.log(route, index);
          return (
            <LiquidCircleButtom
              route={route}
              index={index}
              state={state}
              descriptors={descriptors}
              navigation={navigation}
            />
          );
        })}
      </Animated.View>
    </TapGestureHandler>
  );
}
