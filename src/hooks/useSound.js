import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export const useSound = (path, isLooping = false) => {
  const soundRef = useRef(null);

  const playSound = React.useCallback(async (volume = 1) => {
    // Stop and unload the previous sound instance if it exists
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(path, {
        isLooping,
        volume,
      });
      soundRef.current = newSound;

      // Unload the sound after it finishes playing
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (!status.didJustFinish) return;
        console.log('Unloading sound');
        await newSound.unloadAsync();
        soundRef.current = null;
      });

      await newSound.playAsync();
    } catch (error) {
      console.warn(`Error playing sound: ${error}`);
      console.log(path, isLooping);
    }
  }, [path, isLooping]);

  const stopSound = React.useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return [playSound, stopSound];
};