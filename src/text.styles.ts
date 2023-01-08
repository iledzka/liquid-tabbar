import {StyleSheet, type TextStyle} from 'react-native';
import {colors} from './utils';

type TextStyles = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  subheader: TextStyle;
  subsubheader: TextStyle;
  paragraph: TextStyle;
  greyText: TextStyle;
};

const styles = StyleSheet.create<TextStyles>({
  h1: {
    fontFamily: 'Montserrat-Black',
    color: '#000',
    fontSize: 32,
  },
  h2: {
    fontFamily: 'Montserrat-Black',
    color: colors.black,
    fontSize: 22,
  },
  h3: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 18,
  },
  h4: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  subheader: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  subsubheader: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  paragraph: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  greyText: {
    color: colors.grey,
  },
});

export default styles;
