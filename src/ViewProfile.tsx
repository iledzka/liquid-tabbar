import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  type ViewStyle,
  type ImageStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from './utils';
import textStyles from './text.styles';
import Pill from './Pill';
import Icon from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import {useIsFocused} from '@react-navigation/native';
import {useTransitionAnimation} from './ScreenTransitionAnimationProvider';

function ChartItem({
  height,
  date,
  color,
}: {
  height: number;
  date: string;
  color: string;
}) {
  return (
    <View style={styles.chartItemContainer}>
      <Text style={textStyles.subsubheader}>{height}</Text>
      <View
        style={[
          styles.chartItem,
          {backgroundColor: color, height: height * 1.5},
        ]}
      />
      <Text style={[textStyles.greyText, textStyles.subsubheader]}>{date}</Text>
    </View>
  );
}

export default function ViewProfileScreen({route}) {
  const isFocused = useIsFocused();
  const {blurTab, animatedStyleBlur, animatedStyleFocus, PADDING_HORIZONTAL} =
    useTransitionAnimation();
  const isBlurred = blurTab === route.name;

  return (
    <SafeAreaView style={styles.saveAreaView}>
      <Animated.View
        style={[
          styles.container,
          {paddingHorizontal: PADDING_HORIZONTAL},
          isBlurred
            ? animatedStyleBlur
            : isFocused
            ? animatedStyleFocus
            : undefined,
        ]}>
        <View style={styles.header}>
          <Icon
            name="chevron-left"
            size={28}
            color={colors.black}
            style={styles.chevronIcon}
          />
          <Pill backgroundColor={colors.blue}>
            <View style={styles.headerPill}>
              <Icon
                name="check"
                size={16}
                color={colors.black}
                style={styles.checkIcon}
              />
              <Text style={textStyles.paragraph}>Friends</Text>
            </View>
          </Pill>
        </View>
        <View style={styles.profileSection}>
          <View style={styles.profilePic}>
            <Image
              style={styles.profilePhoto}
              source={require('./assets/images/brunonek.png')}
            />
          </View>
          <Text style={textStyles.h3}>{'Boris\nBrunowsky'}</Text>
        </View>
        <View style={styles.chartHeaderContainer}>
          <View style={styles.chartHeader}>
            <Text style={textStyles.subheader}>Days</Text>
            <Text style={[textStyles.greyText, textStyles.subheader]}>
              Months
            </Text>
          </View>
          <Text style={[textStyles.greyText, textStyles.subsubheader]}>
            (visits in mins)
          </Text>
        </View>
        <View style={styles.chart}>
          <ChartItem height={55} date="28.04" color={colors.blue} />
          <ChartItem height={58} date="30.04" color={colors.blue} />
          <ChartItem height={45} date="01.04" color={colors.pink} />
          <ChartItem height={31} date="05.04" color={colors.pink} />
          <ChartItem height={60} date="28.04" color={colors.blue} />
          <ChartItem height={50} date="30.04" color={colors.blue} />
          <ChartItem height={45} date="01.04" color={colors.pink} />
          <ChartItem height={25} date="05.04" color={colors.pink} />
        </View>
        <View style={styles.hero}>
          <View style={styles.diagonalOverlay} />
          <View style={styles.heroInner}>
            <View style={styles.heroInfo}>
              <View style={styles.heroPoints}>
                <Text style={textStyles.h2}>957</Text>
                <View style={styles.pointsPill}>
                  <Text style={textStyles.subheader}>+2</Text>
                </View>
              </View>
              <Text style={[textStyles.greyText, textStyles.h4]}>place</Text>
            </View>
            <View style={styles.heroInfo}>
              <View style={styles.heroPoints}>
                <Text style={textStyles.h2}>8500</Text>
                <View style={styles.pointsPill}>
                  <Text style={textStyles.subheader}>+200</Text>
                </View>
              </View>
              <Text style={[textStyles.greyText, textStyles.h4]}>points</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

type ViewProfileScreenStyle = {
  saveAreaView: ViewStyle;
  container: ViewStyle;
  chevronIcon: ViewStyle;
  checkIcon: ViewStyle;
  chart: ViewStyle;
  chartHeader: ViewStyle;
  chartHeaderContainer: ViewStyle;
  header: ViewStyle;
  profilePic: ViewStyle;
  profileSection: ViewStyle;
  headerPill: ViewStyle;
  chartItem: ViewStyle;
  chartItemContainer: ViewStyle;
  hero: ViewStyle;
  heroInner: ViewStyle;
  diagonalOverlay: ViewStyle;
  pointsPill: ViewStyle;
  heroInfo: ViewStyle;
  heroPoints: ViewStyle;
  profilePhoto: ImageStyle;
};

const styles = StyleSheet.create<ViewProfileScreenStyle>({
  saveAreaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 200,
    opacity: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
  },
  hero: {
    width: '100%',
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.blue,
    marginVertical: 30,
  },
  heroInner: {
    flexDirection: 'row',
  },
  chart: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  chartHeader: {
    flexDirection: 'row',
    width: '36%',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 20,
  },
  chartHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  chevronIcon: {alignSelf: 'flex-start', marginRight: 30, marginTop: 120},
  checkIcon: {marginHorizontal: 10},
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.mediumGrey,
    marginRight: 20,
    paddingTop: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  headerPill: {flexDirection: 'row', paddingRight: 10, paddingTop: 2},
  chartItem: {
    width: 6,
    borderRadius: 4,
    marginVertical: 10,
  },
  chartItemContainer: {alignItems: 'center'},
  diagonalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 210,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 90,
    borderTopWidth: 120,
    borderRightColor: 'transparent',
    borderTopColor: colors.pink,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  pointsPill: {
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 9,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  heroInfo: {flex: 1, margin: 40},
  heroPoints: {flexDirection: 'row', alignItems: 'center'},
  profilePhoto: {
    resizeMode: 'contain',
    width: 60,
    height: 50,
  },
});
