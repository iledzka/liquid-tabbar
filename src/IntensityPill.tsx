import React from 'react';
import {View, StyleSheet, type ViewStyle} from 'react-native';
import {colors} from './utils';
import Pill from './Pill';

type Intensity = 1 | 2 | 3;
type Props = {
  intensity: Intensity;
};

export default function IntensityPill({intensity = 1}: Props) {
  return (
    <Pill>
      {[1, 2, 3].map(i =>
        i <= intensity ? (
          <View style={[styles.dot, styles.dotActive]} key={`${i}-dot`} />
        ) : (
          <View style={[styles.dot, styles.dotInactive]} key={`${i}-dot`} />
        ),
      )}
    </Pill>
  );
}

type PillStyle = {
  dot: ViewStyle;
  dotActive: ViewStyle;
  dotInactive: ViewStyle;
};

const styles = StyleSheet.create<PillStyle>({
  dot: {borderRadius: 50, width: 6, height: 6, marginHorizontal: 2},
  dotActive: {backgroundColor: colors.black},
  dotInactive: {backgroundColor: colors.mediumGrey},
});
