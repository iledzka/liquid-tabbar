import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {
  useSharedValue,
  runOnJS,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  withSpring,
  cancelAnimation,
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
import {colorsStrings} from './utils';
import {type BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useTransitionAnimation} from './ScreenTransitionAnimationProvider';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');
const RECT_Y = 70;
const CIRCLE_RADIUS = 24;

type Tab = 'Home' | 'Settings' | 'Eye' | 'Heart' | 'User';

export default function LiquidTabBar({state, navigation}: BottomTabBarProps) {
  const [activeTab, setActiveTab] = React.useState<Tab>(
    state.routes[state.index].name as Tab,
  );
  const clickedTab = React.useRef<Tab>(state.routes[state.index].name as Tab);

  const {setBlurTab} = useTransitionAnimation();

  const cy = RECT_Y + CIRCLE_RADIUS + 4;

  const initialCoordinates = state.routes.reduce<
    Record<Tab, {cy: number; cx: number}>
  >((acc, route, index) => {
    const cx = spaceAroundCircleAt(index);
    return {...acc, [route.name]: {cx, cy}};
  }, {} as Record<Tab, {cy: number; cx: number}>);

  const translateY = useValue(cy);
  const interaction = useSharedValue(0);
  const interactionBounce = useSharedValue(0);
  const iconSizeInteraction = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rectWidth = useValue(SCREEN_WIDTH);
  const rectX = useValue(0);
  const colorMatrix = useValue([
    1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 80, -20,
  ]);
  const circleRadius = useSharedValue(CIRCLE_RADIUS);
  const circleScale = useValue(CIRCLE_RADIUS);
  const iconSize = useValue(24);
  const marginScale = useValue(1);

  const getIndex = (name: string) =>
    state.routes.findIndex((route: {name: string}) => route.name === name);

  const handlePressTab = (tab: Tab) => {
    if (clickedTab.current !== tab) {
      setBlurTab(clickedTab.current);

      setActiveTab(tab);
      clickedTab.current = tab;
    }
  };

  useSharedValueEffect(() => {
    if (interaction.value === 1) {
      const index = getIndex(clickedTab.current);

      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes[index].key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({key: state.routes[index].key, merge: true});
      }
    }
  }, interaction);

  const onTouch = useTouchHandler({
    onStart: ({x, y}) => {
      cancelAnimation(circleRadius);
      cancelAnimation(opacity);
      cancelAnimation(interaction);
      cancelAnimation(interactionBounce);
      cancelAnimation(iconSizeInteraction);

      const tab = getPressedTab(x, y);
      if (!tab) {
        return;
      }

      runOnJS(handlePressTab)(tab);

      opacity.value = withSequence(
        withTiming(0, {
          duration: 200,
          easing: Easing.bezier(0, 0.55, 0.45, 1),
        }),
        withDelay(
          500,
          withTiming(1, {
            duration: 200,
            easing: Easing.bezier(0, 0.55, 0.45, 1),
          }),
        ),
      );

      interaction.value = withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.bezier(0.33, 1, 0.68, 1),
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.sin,
        }),
      );

      interactionBounce.value = withSequence(
        withTiming(1, {
          duration: 520,
          easing: Easing.bezier(0, 0.8, 0.45, 1),
        }),
        withTiming(0, {
          duration: 160,
          easing: Easing.elastic(),
        }),
        withSpring(0.2),
      );

      iconSizeInteraction.value = withSequence(
        withDelay(
          400,
          withTiming(1, {
            duration: 50,
            easing: Easing.bezier(0.97, 0.68, 0.21, 1.18),
          }),
        ),
        withDelay(
          318,
          withTiming(0, {
            duration: 10,
            easing: Easing.quad,
          }),
        ),
      );

      circleRadius.value = withSequence(
        withTiming(CIRCLE_RADIUS * 0.8, {
          duration: 400,
          easing: Easing.bezier(0.55, 0.61, 0.98, 0.68),
        }),
        withSpring(0),
        withTiming(CIRCLE_RADIUS, {
          duration: 10,
          easing: Easing.sin,
        }),
      );
    },
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

  const getPressedTab = (x: number, y: number) => {
    for (const [name, {cx, cy}] of Object.entries(initialCoordinates)) {
      var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (distancesquared <= CIRCLE_RADIUS * CIRCLE_RADIUS) {
        return name as Tab;
      }
    }
  };

  useSharedValueEffect(
    () => {
      rectWidth.current = mix(
        interactionBounce.value,
        SCREEN_WIDTH,
        SCREEN_WIDTH - 60,
      );
      rectX.current = mix(interactionBounce.value, 0, 30);
      translateY.current = mix(interaction.value, cy, cy - 74);
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
      marginScale.current = mix(interactionBounce.value, 1, 20);
      iconSize.current = mix(iconSizeInteraction.value, 24, 0);
    },
    interaction,
    opacity,
    interactionBounce,
    iconSizeInteraction,
  );

  useSharedValueEffect(() => {
    circleScale.current = circleRadius.value;
  }, circleRadius);

  const svgHome = useSVG(require('./assets/icons/home.svg'));
  const svgBookmark = useSVG(require('./assets/icons/bookmark.svg'));
  const svgEye = useSVG(require('./assets/icons/eye.svg'));
  const svgHeart = useSVG(require('./assets/icons/heart.svg'));
  const svgUser = useSVG(require('./assets/icons/user.svg'));
  const svgHomeActive = useSVG(require('./assets/icons/home-filled.svg'));
  const svgBookmarkActive = useSVG(
    require('./assets/icons/bookmark-filled.svg'),
  );
  const svgEyeActive = useSVG(require('./assets/icons/eye-filled.svg'));
  const svgHeartActive = useSVG(require('./assets/icons/heart-filled.svg'));
  const svgUserActive = useSVG(require('./assets/icons/user-filled.svg'));

  const getIcon = (name: Tab) => {
    if (name === 'Home') {
      return activeTab === 'Home' ? svgHomeActive : svgHome;
    }
    if (name === 'Settings') {
      return activeTab === 'Settings' ? svgBookmarkActive : svgBookmark;
    }
    if (name === 'Eye') {
      return activeTab === 'Eye' ? svgEyeActive : svgEye;
    }
    if (name === 'Heart') {
      return activeTab === 'Heart' ? svgHeartActive : svgHeart;
    }

    return activeTab === 'User' ? svgUserActive : svgUser;
  };

  const svgY = useComputedValue(
    () => translateY.current - 0.5 * CIRCLE_RADIUS,
    [translateY, CIRCLE_RADIUS],
  );

  const tabColor = useComputedValue(() => {
    const index = getIndex(activeTab);
    return colorsStrings[index] || 'white';
  }, [activeTab]);

  const roundedRectX = useComputedValue(() => {
    if (activeTab) {
      return initialCoordinates[activeTab].cx - circleScale.current / 5;
    }
  }, [circleScale, activeTab]);

  const rounderRectScale = useComputedValue(() => {
    return circleScale.current / 2;
  }, [circleScale]);

  const iconX = useComputedValue(() => {
    const routeNames = Object.keys(initialCoordinates) as Tab[];

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
              <Group key={`group-${index}-${route.name}`}>
                <Circle
                  key={`circle-${index}-${route.name}`}
                  cx={initialCoordinates[route.name as Tab].cx}
                  cy={activeTab === route.name ? translateY : cy}
                  r={circleScale}
                  color={tabColor}
                />
                <RoundedRect
                  key={`rect-${index}-${route.name}`}
                  x={
                    activeTab == null
                      ? initialCoordinates[route.name as Tab].cx
                      : roundedRectX
                  }
                  y={activeTab === route.name ? translateY : cy}
                  r={6}
                  width={rounderRectScale}
                  height={40}
                  color={tabColor}
                />
              </Group>
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
                      ? initialCoordinates[route.name as Tab].cx -
                        0.5 * CIRCLE_RADIUS
                      : Selector(iconX, x => x[index])
                  }
                  y={activeTab === route.name ? svgY : cy - 0.5 * CIRCLE_RADIUS}
                  width={activeTab === route.name ? iconSize : 24}
                  height={activeTab === route.name ? iconSize : 24}
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
  canvas: {
    ...StyleSheet.absoluteFillObject,
    top: -160,
  },
});
