import React from 'react';
import {useWindowDimensions, View, StyleSheet} from 'react-native';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Extrapolate, useSharedValue, withTiming} from 'react-native-reanimated';

import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  interpolate,
  Paint,
  RoundedRect,
  useSharedValueEffect,
  useValue,
  useValueEffect,
} from '@shopify/react-native-skia';

export const WIDTH_ISLAND = 127;
export const HEIGHT_ISLAND = 36;
export const RADIUS_ISLAND = 30;
export const RADIUS_CIRCLE = HEIGHT_ISLAND / 2;
export const MARGIN_TOP = 20;

export const SettingsScreen = () => {
  // state
  const {width} = useWindowDimensions();
  // const paint = usePaintRef();

  const translateY = useSharedValue(0);
  const translateYSkia = useValue(MARGIN_TOP);

  // gesture
  const gesture = Gesture.Pan()
    .onChange(({changeY}) => {
      translateY.value += changeY;
    })
    .onEnd(() => {
      translateY.value = withTiming(RADIUS_CIRCLE + MARGIN_TOP);
    });

  // restyle
  useSharedValueEffect(() => {
    translateYSkia.current = interpolate(
      translateY.value,
      [RADIUS_CIRCLE + MARGIN_TOP - 1, RADIUS_CIRCLE + MARGIN_TOP, 80, 180],
      [RADIUS_CIRCLE + MARGIN_TOP, RADIUS_CIRCLE + MARGIN_TOP, 80, 150],
      Extrapolate.EXTEND,
    );
  }, translateY);
  useValueEffect(translateYSkia, v => {
    console.log({v});
  });

  // render
  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container]}>
        <Canvas style={[styles.canvas]}>
          <Group
            layer={
              <Paint>
                <Blur blur={10} />
                <ColorMatrix
                  matrix={[
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40,
                    -20,
                  ]}
                />
              </Paint>
            }>
            <RoundedRect
              height={HEIGHT_ISLAND}
              width={WIDTH_ISLAND}
              x={(width - WIDTH_ISLAND) / 2}
              y={20}
              r={RADIUS_ISLAND}
            />
            <Circle cx={width / 2} cy={translateYSkia} r={RADIUS_CIRCLE} />
          </Group>
        </Canvas>
        <View style={styles.dynamicIsland} />
      </View>
    </GestureDetector>
  );
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  dynamicIsland: {
    width: WIDTH_ISLAND,
    height: HEIGHT_ISLAND,
    borderRadius: RADIUS_ISLAND,
    backgroundColor: '#000',
    position: 'absolute',
    alignSelf: 'center',
    top: MARGIN_TOP,
  },
});
