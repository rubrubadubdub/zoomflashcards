/********* Magic Word Book *********
 * The Menagerie of Mashed-up Tales
 * Project Name: Expo Template
 * Version 0.0.1
 * Developed by RSR & JBW
 * 2023
 * Description: 
 ***********************************/
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useCallback, useMemo } from 'react';
import { StatusBar, View } from 'react-native';
//import { NavigationContainer, useFocusEffect } from '@react-navigation/native'; //Get useFocusEffect to work for StatusBar
//import { createStackNavigator } from '@react-navigation/stack'; //TODO: Implement route component

//Dealing with app assets
//import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';

//Dependencies for RC
import Constants from 'expo-constants';
//import Purchases from 'react-native-purchases';

//Audio Modules 
import { useMusic } from "./src/hooks/useMusic";
//import useAudio from './src/hooks/useAudio'; //Having issues with the audio player for bg music
import { Audio } from 'expo-av';

//Import Contexts
//import { PurchaseStatusProvider } from './src/contexts/PurchaseStatusContext';

//Import other screen components. (In the future handle with a separate route folder/component)
import Router from './src/components/Router';
import { SafeAreaView } from 'react-native-safe-area-context';

//SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    //Configure Audio for the App
    const setAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
          shouldDuckAndroid: false,
          //interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          //playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log('Error setting audio mode:', error);
      }
    };
    setAudioMode();
  }, []);

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };

    lockOrientation();
  }, []);

  const [fontsLoaded] = useFonts({
    'ShortStack': require("./src/assets/fonts/ShortStack-Regular.otf"),
    'Eyvindur': require('./src/assets/fonts/eyvindur.ttf'),
    'LondrinaRegular': require('./src/assets/fonts/LondrinaSolid-Regular.ttf'),
    'Kawaii': require('./src/assets/fonts/KTEGAKI.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Router />
    </View>
  );
}