import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import {
  Canvas,
  RoundedRect,
  Group,
  Paint,
  ColorMatrix,
  Blur,
  Circle,
  useTouchHandler,
  ImageSVG,
  useSVG,
  useValue,
  useSharedValueEffect,
  mix,
  useComputedValue,
} from '@shopify/react-native-skia';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: SCREEN_SCALE,
} = Dimensions.get('screen');
const RECT_Y = 60;
const CIRCLE_RADIUS = 26;

export default function MyTabBar({state, descriptors, navigation}) {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);

  const handlePressTab = (x: number, y: number) => {
    const tab = getPressedTab(x, y);
    if (!tab) {
      return;
    }
    const index = state.routes.findIndex(route => route.name === tab);
    console.log(state.routes[index]);
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    const isFocused = state.index === index;
    console.log(isFocused);
    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({name: tab, merge: true});
    }
  };
  const onTouch = useTouchHandler({
    onStart: ({x, y}) => {
      runOnJS(handlePressTab)(x, y);

      opacity.value = withSequence(
        withTiming(0, {
          duration: 400,
          easing: Easing.linear,
        }),
        withDelay(
          1200,
          withTiming(1, {
            duration: 500,
            easing: Easing.linear,
          }),
        ),
      );
      interaction.value = withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.sin,
        }),
      );
    },
    onActive: pt => {
      // touchPos.current = pt;
    },
    onEnd: () => {},
  });

  function spaceAroundCircleAt(index: number) {
    const MARGINS = SCREEN_WIDTH - CIRCLE_RADIUS * state.routes.length;
    let OUTER_MARGIN = 4;
    const INNER_MARGIN =
      (MARGINS - 2 * OUTER_MARGIN) / (state.routes.length + 1);
    OUTER_MARGIN += INNER_MARGIN;
    const firstCircle = OUTER_MARGIN + 0.5 * CIRCLE_RADIUS;
    const cx = firstCircle + (INNER_MARGIN + CIRCLE_RADIUS) * index;
    return cx;
  }

  const cy = RECT_Y + CIRCLE_RADIUS + 4;

  const translateY = useValue(cy);
  const interaction = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rectWidth = useValue(SCREEN_WIDTH);
  const rectX = useValue(0);
  const colorMatrix = useValue([
    1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 40, -20,
  ]);

  const initialCoordinates = state.routes.reduce((acc, route, index) => {
    const cx = spaceAroundCircleAt(index);

    return {...acc, [route.name]: {cx, cy}};
  }, {});

  useSharedValueEffect(
    () => {
      rectWidth.current = mix(
        interaction.value,
        SCREEN_WIDTH,
        SCREEN_WIDTH - 60,
      );
      rectX.current = mix(interaction.value, 0, 30);
      translateY.current = mix(interaction.value, cy, cy - 66);
      colorMatrix.current = [
        1,
        opacity.value,
        opacity.value,
        opacity.value,
        0,
        opacity.value,
        1,
        opacity.value,
        opacity.value,
        0,
        opacity.value,
        opacity.value,
        1,
        opacity.value,
        0,
        opacity.value,
        opacity.value,
        opacity.value,
        40,
        -20,
      ];
    },
    interaction,
    opacity,
  );

  const svgHome = useSVG(require('./assets/icons/home.svg'));
  const svgBookmark = useSVG(require('./assets/icons/bookmark.svg'));
  const svgEye = useSVG(require('./assets/icons/eye.svg'));
  const svgHeart = useSVG(require('./assets/icons/heart.svg'));
  const svgUser = useSVG(require('./assets/icons/user.svg'));

  const getIcon = (name: string) => {
    if (name === 'Home') {
      return svgHome;
    }
    if (name === 'Settings') {
      return svgBookmark;
    }
    if (name === 'Eye') {
      return svgEye;
    }
    if (name === 'Heart') {
      return svgHeart;
    }

    return svgUser;
  };

  const svgY = useComputedValue(
    () => translateY.current - 0.5 * CIRCLE_RADIUS,
    [translateY, CIRCLE_RADIUS],
  );

  const getPressedTab = (x, y) => {
    for (const [name, {cx, cy}] of Object.entries(initialCoordinates)) {
      var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (distancesquared <= CIRCLE_RADIUS * CIRCLE_RADIUS) {
        return name;
      }
    }
    return '';
  };

  return (
    <View>
      <Canvas style={styles.canvas} onTouch={onTouch}>
        <Group
          layer={
            <Paint>
              <Blur blur={10} />
              <ColorMatrix matrix={colorMatrix} />
            </Paint>
          }>
          <RoundedRect
            x={rectX}
            y={RECT_Y}
            width={rectWidth}
            height={120}
            r={26}
            color="#FDC8DA"
          />
          {state.routes.map((route: {name: string}, index: number) => {
            return (
              <Circle
                key={`circle-${index}-${route.name}`}
                cx={initialCoordinates[route.name].cx}
                cy={translateY}
                r={CIRCLE_RADIUS}
                color="#FDC8DA"
              />
            );
          })}
        </Group>
        <Group>
          {state.routes.map((route: any, index: number) => {
            const icon = getIcon(route?.name);
            if (icon) {
              return (
                <ImageSVG
                  key={index + route}
                  svg={icon}
                  x={initialCoordinates[route.name].cx - 0.5 * CIRCLE_RADIUS}
                  y={svgY}
                  width={50}
                  height={50}
                />
              );
            }
          })}
        </Group>
      </Canvas>
    </View>
  );
}

export const styles = StyleSheet.create({
  tabBar: {
    height: 200,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    top: -140,
    backgroundColor: 'red',
  },
});
