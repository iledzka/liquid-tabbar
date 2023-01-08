import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from './utils';

const {width: SCREEN_WIDTH} = Dimensions.get('screen');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subheader}>Workout</Text>

      <View style={styles.heroContainer}>
        <View style={styles.heroShadow} />
        <View style={styles.hero}>
          <Text>Athena</Text>
          <Text>Core, lower</Text>
          <View style={styles.heroInfo}>
            <Text>Duration</Text>
            <Text>Difficulty</Text>
          </View>
        </View>
      </View>

      <Text style={styles.subheader}>Categories</Text>

      <View style={styles.carousel}>
        <View style={[styles.carouselItem, styles.carouselItemCardio]}>
          <Text style={styles.carouselItemText}>Cardio</Text>
        </View>
        <View style={[styles.carouselItem, styles.carouselItemFullBody]}>
          <Text style={styles.carouselItemText}>Full body</Text>
        </View>
        <View style={[styles.carouselItem, styles.carouselItemYoga]}>
          <Text style={styles.carouselItemText}>Yoga</Text>
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
  heroContainer: ViewStyle;
  heroInfo: ViewStyle;
  heroShadow: ViewStyle;
  subheader: TextStyle;
};

const styles = StyleSheet.create<HomeScreenStyle>({
  carousel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carouselItem: {
    borderRadius: 30,
    width: SCREEN_WIDTH / 2.6,
    marginRight: 10,
  },
  carouselItemCardio: {
    backgroundColor: colors.blue,
  },
  carouselItemFullBody: {
    backgroundColor: colors.grey,
  },
  carouselItemYoga: {
    backgroundColor: colors.pink,
  },
  carouselItemText: {
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
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
  },
  heroContainer: {
    width: '90%',
    // backgroundColor: 'red',
  },
  heroShadow: {
    backgroundColor: colors.lightGrey,
    borderRadius: 30,
    width: '97%',
    height: 200,
    marginTop: 11,
    marginLeft: 10,
  },
  heroInfo: {
    flexDirection: 'row',
  },
  subheader: {
    fontFamily: 'Montserrat-Bold',
    color: colors.grey,
  },
});
