import React from 'react';
import {View, StyleSheet, type ViewStyle} from 'react-native';

type Props = {
  backgroundColor?: string;
  children: JSX.Element[] | JSX.Element;
};

export default function Pill({children, backgroundColor}: Props) {
  const pillStyle = backgroundColor
    ? [styles.pill, {backgroundColor}]
    : styles.pill;
  return <View style={pillStyle}>{children}</View>;
}

type PillStyle = {
  pill: ViewStyle;
};

const styles = StyleSheet.create<PillStyle>({
  pill: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 7,
  },
});
