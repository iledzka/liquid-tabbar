import React from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  withSequence,
  Easing,
  useAnimatedProps,
  withDelay,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  type TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {clamp, ReText, serialize} from 'react-native-redash';
import Svg, {Path, PathProps} from 'react-native-svg';

const CIRCLE_WIDTH = 50;
const CIRCLE_RADIUS = CIRCLE_WIDTH / 2;

const SLIDER_WIDTH = 80;
import {createCurve} from './bezierSlider/utils';

const AnimatedPath = Animated.createAnimatedComponent<PathProps>(Path);

function LiquidCircleButtom({route, index, state, descriptors, navigation}) {
  const pressed = useSharedValue(false);
  const y = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(CIRCLE_WIDTH / 2);
  // const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const uas = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: scale.value},
        {translateY: y.value}, //withSpring(pressed.value ? -100 : 0)},
      ],
      // opacity: opacity.value,
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

  const eventHandler = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent,
    {offsetX: number}
  >({
    onStart: (event, ctx) => {
      console.log('onStart', event);
      pressed.value = true;
      y.value = withSequence(
        withSpring(-86, {mass: 0.3}),
        withSpring(0, {mass: 0.1, stiffness: 600}),
      );
      translateY.value = withSequence(
        withSpring(-66, {mass: 0.3}),
        withSpring(0, {mass: 0.1, stiffness: 200}),
      );

      scale.value = withSequence(
        withTiming(0.6, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        // withSpring(0),
        withSpring(1),
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
    onActive: (event, context) => {
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

  const animatedProps = useAnimatedProps(() => {
    const {curve} = createCurve(translateX, translateY);
    return {
      d: serialize(curve),
    };
  });

  return (
    <TapGestureHandler onGestureEvent={eventHandler}>
      <Animated.View>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            top: -35,
            left: -12,
          }}>
          <Svg
            width={SLIDER_WIDTH}
            height={20}
            viewBox={`0 0 ${SLIDER_WIDTH} 40`}
            fill="#FDC8DA">
            <AnimatedPath
              animatedProps={animatedProps}
              // stroke="black"
              strokeWidth="2"
            />
          </Svg>
        </View>
        <Animated.View
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          // onLayout={event => {
          //   const layout = event.nativeEvent.layout;
          //   console.log('----- ', index);
          //   console.log('height:', layout.height);
          //   console.log('width:', layout.width);
          //   console.log('x:', layout.x);
          //   console.log('y:', layout.y);
          //   xCircle.value = layout.x;
          //   yCircle.value = layout.y;
          //   console.log('----- END ---');
          // }}
          style={[styles.tabBarButton, uas]}>
          {options.tabBarIcon({
            focused: isFocused,
            color: isFocused
              ? options.tabBarActiveTintColor
              : options.tabBarInactiveTintColor,
            size: 30,
          })}
        </Animated.View>
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
      paddingBottom: withSpring(pressed.value ? 36 : 20),
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
      <Animated.View style={[styles.tabBar, uas]}>
        {state.routes.map((route, index) => {
          return (
            <LiquidCircleButtom
              key={index}
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

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FDC8DA',
  },
  tabBarButton: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    backgroundColor: '#FDC8DA',
  },
});
