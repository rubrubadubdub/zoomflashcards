import React, { useState, useEffect } from 'react';
import { Animated, Image, View, StyleSheet, useWindowDimensions } from 'react-native';

const Caption = ({ captionImage, zone, tilePos, imageAnimatedStyle }) => {
  const { styles } = useStyle();
  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    if(!captionImage){
      return;
    } else {
      //console.log('Caption Image for '+tilePos+' registered.');
    }
  }, []);

  let captionStyle;
  switch (zone) {
    case 1:
      if (tilePos == "top") {
        captionStyle = styles.rightCaptionTop;
      } else {
        captionStyle = styles.rightCaption;
      }
      break;
    case 2:
      captionStyle = styles.leftCaption;
      break;
    case 3:
      if (tilePos == "top") {
        captionStyle = styles.centerCaptionTop;
      } else {
        captionStyle = styles.centerCaption;
      }
      break;
    default:
      captionStyle = styles.leftCaption;
  }

  return (
    <View style={[captionStyle, { flex: 1, justifyContent: 'flex-end', }]} pointerEvents="box-none">
    {captionImage && (
      <>
        <Animated.Image source={captionImage} style={[styles.captionImage, imageAnimatedStyle]} />
      </>
    )}
  </View>
  );
};

const useStyle = () => {


  const { width, height } = useWindowDimensions();
  const SCREEN_WIDTH = width;
  const SCREEN_HEIGHT = height;
  const aspectRatio = 5 / 4;
  const hOffset = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_WIDTH * aspectRatio : SCREEN_WIDTH;
  const vOffset = SCREEN_HEIGHT > SCREEN_WIDTH ? SCREEN_HEIGHT : SCREEN_HEIGHT * aspectRatio;

  const styles = StyleSheet.create({
    container: {
      zIndex: 50,
    },
    leftCaption: {
      position: 'absolute',
      height: '100%',
      width:'45%',
      left: 8,
      //left: (hOffset / 10) + SCREEN_WIDTH * 0.01, //previous calculation. Retired.
      zIndex: 15,
    },
    rightCaption: {
      position: 'absolute',
      height: '100%',
      width:'45%',
      right: 8,
      zIndex: 15,
    },
    rightCaptionTop: {
      position: 'absolute',
      height: '85%',
      top: '15%',
      width:'45%',
      right: 8,
      zIndex: 15,
    },
    centerCaption: {
      position: 'absolute',
      width: '100%',
      height:'30%',
      bottom: 45,
      zIndex: 5,
    },
    centerCaptionTop: {
      position: 'absolute',
      width: '100%',
      height:'25%',
      top: 60,
      zIndex: 5,
    },
    captionImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      zIndex: 1,
        },
  });

  return { styles };
};

export default Caption;