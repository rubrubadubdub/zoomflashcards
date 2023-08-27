import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  useWindowDimensions,
} from "react-native";

const NUM_STARS = 18;

//we are having issues with screen size on different devices. 
//this is an attempt to fix that.
const FallingStars = React.memo(() => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const [stars, setStars] = useState([]);

  //generate a new star map with a fresh array
  useEffect(() => {
    const newStars = Array(NUM_STARS)
      .fill()
      .map(() => ({
        x: Math.random() * SCREEN_WIDTH,
        y: -Math.random() * 2 * SCREEN_HEIGHT,
        size: Math.random() * 50 + 20, //size base of 10, max 50.
        rotation: Math.random() * 360, //can rotate a full 360 deg
        rotationSpeed: Math.random() * 6 - 3, //rotation speed is -3 to 3 
        fallAnimation: new Animated.Value(0),
        rotationAnimation: new Animated.Value(0),
      }));
    setStars(newStars);    

    //populate the starmap with stars that have already fallen.
    const intervalId = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          star.fallAnimation.setValue(star.fallAnimation._value + 4); // slower fall speed
          star.rotationAnimation.setValue(
            star.rotationAnimation._value + star.rotationSpeed
          );

          if (star.fallAnimation._value*0.5 > SCREEN_HEIGHT + star.size) {
            return {
              ...star,
              fallAnimation: new Animated.Value(0),
              x: Math.random() * SCREEN_WIDTH,
              y: -Math.random() * SCREEN_HEIGHT,
              size: Math.random() * 40 + 10,
              rotation: Math.random() * 360,
              rotationSpeed: Math.random() * 2 - 1,
            };
          }
          return star;
        })
      );
    }, 70);

    return () => clearInterval(intervalId);
  }, [SCREEN_WIDTH, SCREEN_HEIGHT]);

  //return the view. 
  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Animated.View
          key={index}
          pointerEvents="none"
          renderToHardwareTextureAndroid={true}
          style={[
            styles.starContainer,
            {
              transform: [
                { translateY: star.fallAnimation },
                { rotate: star.rotationAnimation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
            },
            {
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              marginLeft: star.x,
              marginTop: star.y,
            },
          ]}
        /*  useNativeDriver={true} // use native driver */
        >
          <Image
            source={require("../assets/starsplash.png")}
            style={styles.starImage}
          />
        </Animated.View>
      ))}
    </View>
  );  
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  starContainer: {
    position: "absolute",
  },
  starImage: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
});


export default FallingStars;
