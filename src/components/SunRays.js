import React, { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function SunRays({ style, speed }) {
  const sunRays = require('../assets/rays.png');
  const [duration, setDuration] = useState(0.08);
  const sunRaysProgress = useSharedValue(0);
  const sunRaysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRaysProgress.value}deg` }],
  }));

  useEffect(() => {
    if (!speed || isNaN(speed) || speed <= 0) {
      setDuration(0.08);
    } else {
      setDuration(speed);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      sunRaysProgress.value += duration;
    }, 1000 / 80); // Update 60 times per second for smooth animation

    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  return <Animated.Image style={[sunRaysStyle, style]} source={sunRays} />;
}
