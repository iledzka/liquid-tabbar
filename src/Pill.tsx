import React from 'react';
import {Text, View, StyleSheet, type ViewStyle} from 'react-native';
import {colors} from './utils';
import textStyles from './text.styles';

type Intensity = 1 | 2 | 3;
type Props = {
  name: string;
  intensity: Intensity;
};

export default function Pill({name, intensity = 1}: Props) {
  return (
    <View style={styles.container}>
      <Text style={[textStyles.subsubheader]}>{name}</Text>
      <View style={styles.pill}>
        {[1, 2, 3].map(i =>
          i <= intensity ? (
            <View style={[styles.dot, styles.dotActive]} />
          ) : (
            <View style={[styles.dot, styles.dotInactive]} />
          ),
        )}
      </View>
    </View>
  );
}

type PillStyle = {
  container: ViewStyle;
  pill: ViewStyle;
  dot: ViewStyle;
  dotActive: ViewStyle;
  dotInactive: ViewStyle;
};

const styles = StyleSheet.create<PillStyle>({
  container: {flexDirection: 'row', alignItems: 'center'},
  pill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 7,
  },
  dot: {borderRadius: 50, width: 6, height: 6, marginHorizontal: 2},
  dotActive: {backgroundColor: colors.black},
  dotInactive: {backgroundColor: colors.mediumGrey},
});
