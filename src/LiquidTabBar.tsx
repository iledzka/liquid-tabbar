import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {
  useSharedValue,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
  Easing,
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
  Selector,
} from '@shopify/react-native-skia';

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: SCREEN_SCALE,
} = Dimensions.get('screen');
const RECT_Y = 60;
const CIRCLE_RADIUS = 24;

export default function MyTabBar({state, descriptors, navigation}) {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);

  const handlePressTab = (x: number, y: number) => {
    const tab = getPressedTab(x, y);

    setActiveTab(tab);
    if (!tab) {
      return;
    }
    const index = state.routes.findIndex(route => route.name === tab);

    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    const isFocused = state.index === index;

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
          duration: 200,
          easing: Easing.linear,
        }),
        withDelay(
          1200,
          withTiming(1, {
            duration: 300,
            easing: Easing.linear,
          }),
        ),
      );

      interaction.value = withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.25, 1.5, 0.1, 1),
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.sin,
        }),
      );

      circleRadius.value = withSequence(
        withTiming(CIRCLE_RADIUS * 0.7, {
          duration: 1000,
          easing: Easing.bezier(0.25, 1, 0.5, 1),
        }),
        withTiming(CIRCLE_RADIUS, {
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
    1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 80, -20,
  ]);
  const circleRadius = useSharedValue(CIRCLE_RADIUS);
  const circleScale = useValue(CIRCLE_RADIUS);

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
      translateY.current = mix(interaction.value, cy, cy - 60);
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
        80,
        -20,
      ];
      marginScale.current = mix(interaction.value, 1, 20);
    },
    interaction,
    opacity,
  );

  useSharedValueEffect(() => {
    circleScale.current = circleRadius.value;
  }, circleRadius);

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

  const tabColor = useComputedValue(() => {
    const colors = [
      'rgb(235,200,253)',
      'rgb(253,200,218)',
      'rgb(218,253,200)',
      'rgb(200,253,235)',
      'rgb(200,218,253)',
    ];
    const index = state.routes.findIndex(route => route.name === activeTab);
    return colors[index] || 'white';
  }, [activeTab]);

  const marginScale = useValue(1);
  const iconX = useComputedValue(() => {
    const routeNames = Object.keys(initialCoordinates);

    const scales = routeNames.map((key, i) => {
      if (!activeTab) {
        return initialCoordinates[key].cx - 0.5 * CIRCLE_RADIUS;
      }
      const activeIndex = routeNames.findIndex(name => name === activeTab);
      if (i < activeIndex) {
        return (
          initialCoordinates[key].cx - 0.5 * CIRCLE_RADIUS + marginScale.current
        );
      }
      return (
        initialCoordinates[key].cx - 0.5 * CIRCLE_RADIUS - marginScale.current
      );
    });
    return scales;
  }, [marginScale, activeTab]);

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
            color={tabColor}
          />
          {state.routes.map((route: {name: string}, index: number) => {
            return (
              <Circle
                key={`circle-${index}-${route.name}`}
                cx={initialCoordinates[route.name].cx}
                cy={activeTab === route.name ? translateY : cy}
                r={circleScale}
                color={tabColor}
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
                  x={
                    activeTab === route.name
                      ? initialCoordinates[route.name].cx - 0.5 * CIRCLE_RADIUS
                      : Selector(iconX, x => x[index])
                  }
                  y={activeTab === route.name ? svgY : cy - 0.5 * CIRCLE_RADIUS}
                  width={24}
                  height={24}
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
  },
});
