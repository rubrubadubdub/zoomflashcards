import React, { useEffect, useState } from 'react';
//Import other screen components. (In the future handle with a separate route folder/component)
import FirstPageChangeMe from '../pages/FirstPageChangeMe';
//import SettingsScreen from '../pages/SettingsScreen';

//Other imports
import { NavigationContainer, useFocusEffect } from '@react-navigation/native'; //Get useFocusEffect to work for StatusBar
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

function Router() {
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const preloadAssets = async () => {
      // Wait for the assets to be preloaded
      /* reconfig for new app
      const { images, animations, sounds1, exampleSounds1, exampleSounds2 } = getAssetsFromWordData(wordData);
      await Promise.all([
        ...images.map(image => Asset.loadAsync(image)),
        ...animations.map(animPath => Asset.loadAsync(animPath)),
        ...sounds1.map(sound1 => Asset.loadAsync(sound1)),
        ...exampleSounds1.map(exSound1 => Asset.loadAsync(exSound1)),
        ...exampleSounds2.map(exSound2 => Asset.loadAsync(exSound2)),
      ]);
      */
      setIsLoaded(true);
    };
    preloadAssets();
  }, []);

  useEffect(() => {
    if (isLoaded) {
        console.log("preloaded all assets");
      const hideSplashScreen = async () => {
        await SplashScreen.hideAsync();
      };
      hideSplashScreen();
    }
  }, [isLoaded]);

  //Helper function for preloading wordData assets
  /* fix for new app
  function getAssetsFromWordData(wordData) {
    const images = wordData.flatMap(word => word.imagePath);
    const animations = wordData.flatMap(word => word.animPath);
    const sounds1 = wordData.flatMap(word => word.sound1);
    const exampleSounds1 = wordData.flatMap(word => word.exSound1);
    const exampleSounds2 = wordData.flatMap(word => word.exSound2);
    return { images, animations, sounds1, exampleSounds1, exampleSounds2 };
  }
  */
  
  return (
    <NavigationContainer>
          <Stack.Navigator initialRouteName="FirstPageChangeMe" screenOptions={{headerShown: false}}>
            <Stack.Screen
              name="FirstPageChangeMe"
              component={FirstPageChangeMe}
              options={{ headerShown: false }}
              //initialParams={{ card: null, group: null, cat: null }}
            />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

export default Router;