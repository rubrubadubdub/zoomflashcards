import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, useWindowDimensions, View, StyleSheet } from 'react-native';
import Caption from './Caption';

const ImageSection = ({ tile, width, height, onSwipe, backgroundImage, position }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scaleFactor = screenWidth/800;
  const { styles } = useStyle();
  const [pressed, setPressed] = useState(false);
  //Zone is populated
  const [zone1, setZone1] = useState(false);
  const [zone2, setZone2] = useState(false);
  const [zone3, setZone3] = useState(false);

  useEffect(() => {
    if(tile.zone_1 && tile.zone_1 != ""){
      setZone1(true);
    }
    if(tile.zone_2 && tile.zone_2 != ""){
      //console.log('found a zone 2 asset');
      setZone2(true);
    }
    if(tile.zone_3 && tile.zone_3 != ""){
      setZone3(true);
    }
  }, [tile]);


  useEffect(() => {
    Animated.timing(pan.x, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [tile, pan.x]);
  

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
          const swipeValue = gestureState.dx > 0 ? width : -width;
          const swipeDirection = gestureState.dx > 0 ? "right" : "left";
          onSwipe(swipeDirection)
          Animated.timing(pan.x, {
            toValue: swipeValue,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
          });
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
      <View style={[styles.tileContainer]} {...panResponder.panHandlers}>
      {zone1 && (
        <Caption
          captionImage={tile.zone_1}
          zone={1}
          tilePos={tile.position}
          imageAnimatedStyle={imageAnimatedStyle}
        />
      )}
      {zone2 && (
        <Caption
          captionImage={tile.zone_2}
          zone={2}
          tilePos={tile.position}
          imageAnimatedStyle={imageAnimatedStyle}
        />
      )}
      {zone3 && (
        <Caption
          captionImage={tile.zone_3}
          zone={3}
          tilePos={tile.position}
          imageAnimatedStyle={imageAnimatedStyle}
        />
      )}
        <Animated.Image
          source={backgroundImage}
          resizeMode="stretch"
          style={[StyleSheet.absoluteFill, { width: width, height: height}, imageAnimatedStyle, pressed && styles.pressed]}
        />
        <Animated.Image
          source={tile.tileImage}
          style={[styles.image, { width: "100%", height: '100%'}, imageAnimatedStyle, position === "top" ? styles.topStyle : styles.bottomStyle]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const useStyle = () => {

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const aspectRatio = 5 / 4;
  const isFitByHeight = screenWidth / (screenHeight / 2) > aspectRatio;
  const scaledImageHeight = screenWidth * 4 / 5;
  const verticalSpace = (screenHeight / 2 - scaledImageHeight) / 2;


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    overflow: 'visible',
  },
  tileContainer: {
    width: screenWidth,
    height: screenHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
   width: screenWidth,
  },
  pressed: {
    //pressed styles here
  },
  topStyle: {
    top: isFitByHeight ? 0 : verticalSpace,
  },
  bottomStyle: {
    bottom: isFitByHeight ? 0 : verticalSpace + 1,
    //alignItems: 'flex-start',
  },
});

return { styles };
};

export default ImageSection;
