import * as Font from "expo-font";

export default useFonts = async () =>
  await Font.loadAsync({
    'ShortStack': require("../assets/fonts/ShortStack-Regular.otf"),
    'Eyvindur': require('../assets/fonts/eyvindur.ttf'),
  });
