import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from './utils';
import textStyles from './text.styles';
import IntensityPill from './IntensityPill';
import Icon from 'react-native-vector-icons/Feather';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Icon
        name="menu"
        size={28}
        color={colors.black}
        style={styles.menuIcon}
      />
      <Text style={[textStyles.greyText, textStyles.h4, styles.sectionTitle]}>
        Workout
      </Text>

      <View style={styles.heroContainer}>
        <View style={styles.heroShadow} />
        <View style={styles.hero}>
          <Text style={[textStyles.h1, styles.heroTitle]}>Athena</Text>
          <Text style={[textStyles.subsubheader, textStyles.greyText]}>
            Core, Lower
          </Text>
          <View style={styles.heroInfo}>
            <View style={styles.pillContainer}>
              <Text style={textStyles.subsubheader}>Duration</Text>
              <IntensityPill intensity={1} />
            </View>
            <View style={styles.pillContainer}>
              <Text style={textStyles.subsubheader}>Difficulty</Text>
              <IntensityPill intensity={2} />
            </View>
          </View>
        </View>
      </View>

      <Text style={[textStyles.greyText, textStyles.h4, styles.sectionTitle]}>
        Categories
      </Text>

      <View style={styles.carousel}>
        <View style={[styles.carouselItem, styles.carouselItemCardio]}>
          <Text style={[textStyles.h3, styles.carouselItemText]}>Cardio</Text>

          <Image
            style={styles.carouselImg}
            source={require('./assets/images/cardio.png')}
          />
        </View>
        <View style={[styles.carouselItem, styles.carouselItemFullBody]}>
          <Text style={[textStyles.h3, styles.carouselItemText]}>
            {'Full\nbody'}
          </Text>
          <Image
            style={styles.carouselSmaller}
            source={require('./assets/images/full-body.png')}
          />
        </View>
        <View style={[styles.carouselItem, styles.carouselItemYoga]}>
          <Text style={[textStyles.h3, styles.carouselItemText]}>Yoga</Text>

          <Image
            style={styles.carouselImg}
            source={require('./assets/images/yoga.png')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

type HomeScreenStyle = {
  carousel: ViewStyle;
  carouselItem: ViewStyle;
  carouselItemCardio: ViewStyle;
  carouselItemFullBody: ViewStyle;
  carouselItemYoga: ViewStyle;
  carouselItemText: TextStyle;
  container: ViewStyle;
  hero: ViewStyle;
  heroTitle: TextStyle;
  heroContainer: ViewStyle;
  heroInfo: ViewStyle;
  heroShadow: ViewStyle;
  sectionTitle: TextStyle;
  carouselImg: ImageStyle;
  carouselSmaller: ImageStyle;
  menuIcon: ViewStyle;
  pillContainer: ViewStyle;
};

const styles = StyleSheet.create<HomeScreenStyle>({
  carousel: {
    flexDirection: 'row',
  },
  carouselItem: {
    borderRadius: 30,
    width: SCREEN_WIDTH / 2.6,
    marginRight: 10,
    justifyContent: 'flex-end',
  },
  carouselItemCardio: {
    backgroundColor: colors.blue,
  },
  carouselItemFullBody: {
    backgroundColor: colors.mediumGrey,
  },
  carouselItemYoga: {
    backgroundColor: colors.pink,
  },
  carouselItemText: {
    padding: 30,
  },
  carouselImg: {
    resizeMode: 'cover',
    width: 120,
    height: 134,
  },
  carouselSmaller: {
    resizeMode: 'cover',
    width: 120,
    height: 120,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 200,
  },
  hero: {
    backgroundColor: colors.pink,
    borderRadius: 30,
    position: 'absolute',
    left: 0,
    right: 10,
    height: 200,
    padding: 28,
  },
  heroContainer: {
    width: '90%',
    paddingBottom: 20,
  },
  heroShadow: {
    backgroundColor: colors.lightGrey,
    borderRadius: 30,
    width: '97%',
    height: 200,
    marginLeft: 10,
    marginTop: 10,
  },
  heroInfo: {
    flexDirection: 'row',
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  heroTitle: {
    paddingTop: 16,
  },
  sectionTitle: {
    paddingHorizontal: 60,
    paddingVertical: 28,
    alignSelf: 'flex-start',
  },
  menuIcon: {alignSelf: 'flex-end', marginRight: 30, marginTop: 120},
  pillContainer: {flexDirection: 'row'},
});
