import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const ImageSequenceAnimator = ({ images, frameRate, onAnimationEnd, style }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (prevIndex === images.length - 1) {
          onAnimationEnd();
          clearInterval(interval);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [frameRate, images, onAnimationEnd]);

  return (
    <View style={styles.container}>
      <Image source={images[currentImageIndex]} style={style} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageSequenceAnimator;