import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, Dimensions, View, StyleSheet } from 'react-native';
import Caption from './Caption';

const TopImageSection = ({ tile, width, height, onSwipe, backgroundImage, screenHeight }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    Animated.timing(pan.x, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [tile]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setPressed(true);
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      setPressed(false);
      pan.flattenOffset();

      if (Math.abs(gestureState.dx) > width * 0.25) {
        onSwipe();
        pan.setValue({ x: -width, y: 0 });
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      }
    },
  });

  const containerAnimatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }],
    elevation: pressed ? 5 : 0,
  };

  const imageAnimatedStyle = {
    transform: [{ scaleX: pressed ? 1.05 : 1 }, { scaleY: pressed ? 1.05 : 1 }],
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View style={styles.tilecontainer}>
        <Animated.Image
          source={backgroundImage}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, { width, height }, imageAnimatedStyle, pressed && styles.pressed]}
        />
        <Animated.Image
          {...panResponder.panHandlers}
          source={tile.tileImage}
          style={[styles.image, { width, height }, imageAnimatedStyle]}
          resizeMode="contain"
        />
        <Caption zone={tile.zone_1} position={tile.zone_1_pos} />
        <Caption zone={tile.zone_2} position={tile.zone_2_pos} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tilecontainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    //styles here
    },
    pressed: {
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    },
});

export default TopImageSection;
