import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {clamp, ReText, serialize} from 'react-native-redash';
import Svg, {Path, PathProps} from 'react-native-svg';

const PADDING_HORIZONTAL = 20;
import {DOT_SIZE, SLIDER_WIDTH} from './constants';
import {styles} from './styles';
import {createCurve} from './utils';

interface BezierSliderProps {}

const AnimatedPath = Animated.createAnimatedComponent<PathProps>(Path);

export const BezierSlider: React.FC<BezierSliderProps> = ({}) => {
  const translateX = useSharedValue<number>(DOT_SIZE / 2);
  const translateY = useSharedValue<number>(0);

  const animatedProps = useAnimatedProps(() => {
    const {curve} = createCurve(translateX, translateY);
    return {
      d: serialize(curve),
    };
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number}
  >({
    onActive: ({translationX}, context) => {
      translateX.value = clamp(
        translationX + context.offsetX,
        0 + DOT_SIZE / 2,
        SLIDER_WIDTH - DOT_SIZE / 2 - PADDING_HORIZONTAL,
      );
    },
    onEnd: (_event, _) => {
      translateY.value = withSpring(0, {
        damping: 10,
        mass: 1,
        stiffness: 180,
        velocity: 15,
      });
    },
    onStart: (_event, context) => {
      translateY.value = withSpring(-15, {
        damping: 10,
        mass: 1,
        stiffness: 180,
        velocity: 15,
      });
      context.offsetX = translateX.value;
    },
  });

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          <View style={{...StyleSheet.absoluteFillObject}}>
            <Svg
              width={SLIDER_WIDTH}
              height={40}
              viewBox={`0 0 ${SLIDER_WIDTH} 40`}
              fill="blue">
              <AnimatedPath
                animatedProps={animatedProps}
                stroke="black"
                strokeWidth="2"
              />
            </Svg>
          </View>

          <Animated.View style={[styles.dot, animatedDotStyle]} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
