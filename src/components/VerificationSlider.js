import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Animated, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { transMem } from "../data/TransMem.js";

const VerificationSlider = (props) => {
  const language = props.language;
  const { styles } = useStyle(language);
  const [userInput, setUserInput] = useState('');
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState(0);
  const [result, setResult] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const { width, height } = useWindowDimensions();
  const SCREEN_WIDTH = width;
  const SCREEN_HEIGHT = height;

  const slideAnim = useRef(new Animated.Value(-300)).current;

  //Dynamic populate TEXT with language
  const getTrans = (id) => {
    if (!id) { return "empty" }
    try {
      const entry = transMem.find((item) => item.id === id);

      if (entry && entry[language]) {
        return entry[language];
      } else {
        // Fallback to English if the translation is not found for the given language
        return entry ? entry.english : 'empty';
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (showSlider) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH * 0.5,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH * -0.5,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [showSlider]);



  const checkAnswer = () => {
    console.log("user inputed: " + userInput, ". Correct answer is: " + answer);
    const [a, b] = result.split('*').map(x => parseInt(x.trim()));
    return parseInt(userInput) === answer;
  };

  const handleAnswerSubmit = () => {
    if (checkAnswer()) {
      console.log('Answer Correct!');
      props.onVerificationResult(true);
    } else {
      console.log('Answer incorrect!!');
      props.onVerificationResult(false);
    }
    setShowSlider(false);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
    <View ></View>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={150}
    style={styles.wrapper}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {getTrans('501')}
        </Text>
      </View>
      </TouchableWithoutFeedback>
      <View style={styles.problemContainer}>
        <Text style={styles.problemText}>
          {problem}
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={setUserInput}
          value={userInput}
        />
        <Text style={styles.submitText} onPress={handleAnswerSubmit}>
          Submit
        </Text>
      </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const useStyle = (language) => {
  const { width, height } = useWindowDimensions();
  const SCREEN_WIDTH = width;
  const SCREEN_HEIGHT = height;

  console.log('lang: '+language)

  const getFontFamily = (pos) => {
    if (language) {
      switch (language) {
        case 'jp':
          return 'Kawaii';
        case 'en':
          if (pos == "title") {
            return 'Eyvindur';
          } else {
            return 'ShortStack';
          }
        default:
          if (pos == "title") {
            return 'Eyvindur';
          } else {
            return 'ShortStack';
          }
      }

    } else {
      if (pos == "title") {
        return 'Eyvindur';
      } else {
        return 'ShortStack';
      }
    }
  }

  const styles = StyleSheet.create({
    bgFade: {
      position: 'absolute',
      background: 'rgba(0,0,0,0.5)',
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
    },
    container: {
      position: 'absolute',
      top: 0,
      right: SCREEN_WIDTH * -0.5,
      height: '100%',
      width: SCREEN_WIDTH * 0.6,
      backgroundColor: 'rgba(255, 0, 0, 1)',
      padding: 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    messageContainer: {
      padding: '10%',
    },
    messageText: {
      fontSize: SCREEN_HEIGHT > 720 ? 38 : 24,
      fontFamily: getFontFamily(),
    },
    problemContainer: {
      alignItems: 'center',
    },
    problemText: {
      fontSize: 45,
      fontWeight: 'bold',
      marginBottom: 10,
      fontStyle: 'white',
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 5,
      width: 100,
      marginBottom: 10,
    },
    submitText: {
      color: 'blue',
      fontSize: 18,
    }
  });

  return { styles };
};

export default VerificationSlider;