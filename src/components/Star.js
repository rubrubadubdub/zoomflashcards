import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, useWindowDimensions, Animated } from "react-native";
import Sprite from "./Sprite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Star = ({ posX, posY, word }) => {
  const { styles } = useStyle(posX, posY);
  const { width, height } = useWindowDimensions();

  //sprite handle const
  const spriteRef = useRef();
  const [shouldStopAnimation, setShouldStopAnimation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [animationType, setAnimationType] = useState("rest");
  const [animationStopped, setAnimationStopped] = useState(true);

  //establish async storage
  const [starcount, setStarcount] = useState(0); //Set Starcount
  const [starGranted, setStarGranted] = useState(false); //Was a star given yet?
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const loadSettings = async () => {
    try {
      const starValue = await AsyncStorage.getItem("starcount");
      if (starValue !== null) {
        setStarcount(Number(starValue));
      } else {
        setStarcount(0);
      }
    } catch (error) {
      console.log(error);
    }
    setSettingsLoaded(true);
  }

  const saveSettings = async (a, b) => {
    try {

      await AsyncStorage.setItem(a, b);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (spriteRef.current && shouldStopAnimation) {
      // spriteRef.current.stop();
    }
  }, [shouldStopAnimation]);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    handleAnimation();
  }, [settingsLoaded]);

  const handleAnimation = () => {
    if (shouldStopAnimation) {
      setShouldStopAnimation(false);
    }

    try {
      if (spriteRef.current) {
        setAnimationStopped(false);
        setAnimationType("loop");
        spriteRef.current.play({
          type: "loop",
          fps: 12,
          loop: true,
        });
      }
      setAnimationKey(animationKey + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = () => {
    //onPress && onPress();

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -height / 4,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      grantStar();
      setStarGranted(true);
    });
  };

  const grantStar = () => {
    const addstar = starcount + 1;
    saveSettings("starcount", String(addstar));
    setStarGranted(true);
  }

  const animatedStyle = {
    transform: [
      { translateY: translateY },
      { scaleX: scale },
      { scaleY: scale },
    ],
  };

  return (
    <TouchableOpacity style={styles.starContainer} onPress={() => {
      handlePress();
      }} 
      disabled={starGranted}>
      <Animated.View style={[animatedStyle, { opacity: starGranted ? 0 : 1 }]}>
        <Sprite
          src={require("../assets/other/spinning_star.png")}
          frameCount={8}
          refWidth={height > 720 ? 100 : 50}
          refHeight={height > 720 ? 100 : 50}
          spriteRef={spriteRef}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};


const useStyle = (posX, posY) => {

  const { width, height } = useWindowDimensions();
  const [savedX, setSavedX] = useState(null);
  const [savedY, setSavedY] = useState(null);
  const SCREEN_WIDTH = width;
  const SCREEN_HEIGHT = height;

  const starX = () => {
    if (!savedX || savedX == 0) {
      if (posX) {
        setSavedX(posX);
        return posX;
      } else {
        const randx = Math.random() * (SCREEN_WIDTH - 100);
        setSavedX(randx);
        return randx;
      }
    } else {
      return savedX;
    }
  };

  const starY = () => {
    if (!savedY || savedY == 0) {
      if (posY) {
        setSavedY(posY);
        return posY;
      } else {
        const randy = Math.random() * (SCREEN_HEIGHT - 100);
        setSavedY(randy);
        return randy;
      }
    } else {
      return savedY
    }
  };

  const styles = StyleSheet.create({
    starContainer: {
      position: "absolute",
      top: starY(),
      left: starX(),
      zIndex: 10,
    },
    spriteContainer: {
      zIndex: 12,
    },
    star: {
      width: SCREEN_HEIGHT > 720 ? 100 : 50,
      height: SCREEN_HEIGHT > 720 ? 100 : 50,
      resizeMode: "contain",
    },
  });

  return { styles };
};

export default Star;