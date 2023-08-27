/* 
    This hooks abstracts away all the logic of 
    loading up and unloading songs. All the hook 
    takes in is the require path of the audio
*/
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useMusic = (path, isLooping = false) => {
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playSound = React.useCallback(async (volume = 1) => {
    try {
      const { sound } = await Audio.Sound.createAsync(path, {
        isLooping,
        volume,
      });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Error playing sound: ${error}`);
      //console.log(path, isLooping);
    }
  }, [path, isLooping]);

  const stopSound = React.useCallback(async () => {
    if (sound) {
      await sound.stopAsync();
    }
  }, [sound, isLooping]);

  const isSoundPlaying = React.useCallback(async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      return status.isPlaying;
    }
    return false;
  }, [sound]);

  return [playSound, stopSound, isSoundPlaying];
};