import React, {createContext, useContext, useState} from 'react';
import {
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from 'react-native-reanimated';

interface ScreenTransitionAnimationContext {
  blurTab: string | undefined;
  setBlurTab: React.Dispatch<React.SetStateAction<string | undefined>>;
  animatedStyleBlur: {
    paddingHorizontal: number;
    paddingVertical: number;
    opacity: number;
  };
  animatedStyleFocus: {
    paddingHorizontal: number;
    paddingVertical: number;
  };
  PADDING_HORIZONTAL: number;
}

const ScreenTransitionAnimationStateContext =
  createContext<ScreenTransitionAnimationContext>(
    {} as ScreenTransitionAnimationContext,
  );

const ScreenTransitionAnimationProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [blurTab, setBlurTab] = useState<string>();

  const PADDING_HORIZONTAL = 20;

  const animatedStyleFocus = useAnimatedStyle(() => {
    return {
      paddingHorizontal: withSequence(
        withTiming(40, {
          duration: 400,
          easing: Easing.bezierFn(0, 0.8, 0.45, 1),
        }),
        withSpring(PADDING_HORIZONTAL),
      ),
      paddingVertical: withSequence(
        withTiming(40, {
          duration: 400,
          easing: Easing.bezierFn(0, 0.8, 0.45, 1),
        }),
        withSpring(0),
      ),
    };
  });

  const animatedStyleBlur = useAnimatedStyle(() => {
    return {
      paddingHorizontal: withSequence(
        withTiming(40, {
          duration: 400,
          easing: Easing.bezierFn(0, 0.8, 0.45, 1),
        }),
        withSpring(PADDING_HORIZONTAL),
      ),
      paddingVertical: withSequence(
        withTiming(40, {
          duration: 400,
          easing: Easing.bezierFn(0, 0.8, 0.45, 1),
        }),
        withSpring(0),
      ),
      opacity: withSequence(
        withTiming(0, {
          duration: 500,
          easing: Easing.bezierFn(0, 0.8, 0.45, 1),
        }),
        withSpring(1),
      ),
    };
  });

  const value = {
    blurTab,
    setBlurTab,
    animatedStyleBlur,
    animatedStyleFocus,
    PADDING_HORIZONTAL,
  };

  return (
    <ScreenTransitionAnimationStateContext.Provider value={value}>
      {children}
    </ScreenTransitionAnimationStateContext.Provider>
  );
};

function useTransitionAnimation() {
  const context = useContext(ScreenTransitionAnimationStateContext);
  // eslint-disable-next-line eqeqeq
  if (context == undefined) {
    throw new Error(
      'useTransitionAnimation must be used within a ScreenTransitionAnimationProvider',
    );
  }

  return context;
}

export {ScreenTransitionAnimationProvider, useTransitionAnimation};
