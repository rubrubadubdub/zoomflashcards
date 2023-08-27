import React, { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';

const useAudio = ({ throttleTime = 200 } = {}) => {
  const soundObjectsRef = useRef({});
  const lastPlayedAtRef = useRef({});

  const playAudio = useCallback(async (audioSource, looping = false) => {
    if (!audioSource) {
      return null;
    }
  
    const now = Date.now();
    const lastPlayedAt = lastPlayedAtRef.current[audioSource] || 0;
  
    if (now - lastPlayedAt < throttleTime) {
      //console.log("audio throttled");
      return null;
    }
  
    lastPlayedAtRef.current[audioSource] = now;
  
    // Generate a unique id for the sound
    const id = `${audioSource}-${now}`;
  
    return new Promise(async (resolve) => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: true, isLooping: looping },
          null,
          false
        );
  
        soundObjectsRef.current[id] = sound;
  
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!looping && status.didJustFinish) {
            sound.unloadAsync().catch(() => { });
            delete soundObjectsRef.current[id];
            resolve(id); // Return the id when the sound finishes playing
          }
        });
      } catch (error) {
        console.log('Error while playing audio:', error);
        resolve(id); // Return the id even if there's an error
      }
    });
  }, []);

  const stopAudio = useCallback(async (id) => {
    if (soundObjectsRef.current[id]) {
      try {
        await soundObjectsRef.current[id].stopAsync();
        await soundObjectsRef.current[id].unloadAsync();
        delete soundObjectsRef.current[id];
      } catch (error) {
        console.log('Error while stopping audio:', error);
      }
    }
  }, []);

  const isPlaying = useCallback((id) => {
    const soundObject = soundObjectsRef.current[id];

    if (!soundObject) {
      return false;
    }

    return new Promise(async (resolve) => {
      try {
        const status = await soundObject.getStatusAsync();
        resolve(status.isPlaying);
      } catch (error) {
        console.log('Error while checking if sound is playing:', error);
        resolve(false);
      }
    });
  }, []);

  return {
    playAudio,
    stopAudio,
    isPlaying,
  };
};

export default useAudio;