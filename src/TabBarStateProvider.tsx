import React, {createContext, useContext, useState} from 'react';
import {useTouchHandler} from '@shopify/react-native-skia';

const TabBarStateContext = createContext({});

const TabBarStateProvider = ({state, descriptors, navigation, children}) => {
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

  const {options} = descriptors[route?.key];

  const isFocused = state.index === index;

  const handleOnTouch = useTouchHandler({
    onStart: ({x, y}) => {
      console.log(x, y);
      interaction.value = withSequence(
        withTiming(1, {
          duration: 500,
          easing: Easing.ease,
        }),
        withTiming(0, {
          duration: 300,
          easing: Easing.circle,
        }),
      );
      opacity.value = withSequence(
        withTiming(0, {
          duration: 200,
          easing: Easing.linear,
        }),
        withDelay(
          1000,
          withTiming(1, {
            duration: 500,
            easing: Easing.linear,
          }),
        ),
      );
    },
    onActive: pt => {
      // touchPos.current = pt;
    },
    onEnd: () => {},
  });

  const value = {handleOnTouch};

  return (
    <TabBarStateContext.Provider value={value}>
      {children}
    </TabBarStateContext.Provider>
  );
};

function useTabBarState() {
  const context = useContext(TabBarStateContext);
  // eslint-disable-next-line eqeqeq
  if (context == undefined) {
    throw new Error('useTabBarState must be used within a TabBarStateProvider');
  }
  return context;
}

export {TabBarStateProvider, useTabBarState};
