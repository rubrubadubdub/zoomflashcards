import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { transMem } from "../data/TransMem.js";

const VerificationPopup = (props) => {
    const language = props.language;
    const { styles } = useStyle(language);
    const [showSlider, setShowSlider] = useState(false);
    const [birthYearInput, setBirthYearInput] = useState('');
    const { width, height } = useWindowDimensions();
    const SCREEN_WIDTH = width;
    const SCREEN_HEIGHT = height;

    const slideAnim = useRef(new Animated.Value(300)).current;

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
                toValue: SCREEN_HEIGHT * 0.5,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT * -0.5,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [showSlider]);

    const checkAge = () => {
        if (parseInt(birthYearInput) < 1923) { return false }
        const currentYear = new Date().getFullYear();
        const userBirthYear = parseInt(birthYearInput);
        const age = currentYear - userBirthYear;
        return age >= 18;
    };

    const handleAnswerSubmit = () => {
        if (checkAge()) {
            //console.log('Age verification successful!');
            props.onVerificationResult(true);
        } else {
            //console.log('Age verification failed!');
            props.onVerificationResult(false);
        }
        setShowSlider(false);
    };

    const CustomNumberInput = ({ value, onPress }) => {
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.customNumberInput}>
                    <Text style={styles.customNumberText}>{value}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const onNumberPress = (number) => {
        if (birthYearInput.length < 4) {
            setBirthYearInput(birthYearInput + number);
        }
    };

    const closeSlider = () => {
        //console.log('closed slider');
        props.onVerificationResult(false);
        setShowSlider(false);
      };

    //Not using
    const clearInput = () => {
        setBirthYearInput('');
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={closeSlider}>
                <View style={styles.bgFade}></View>
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                        {getTrans('501')}
                    </Text>
                </View>
                <View style={styles.problemContainer}>
                    <Text style={styles.problemText}>{getTrans('502')}</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.input}>{birthYearInput}</Text>
                    </View>
                    <View style={styles.numbersContainer}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
                            <CustomNumberInput key={number} value={number} onPress={() => onNumberPress(number.toString())} />
                        ))}
                    </View>
                    <TouchableOpacity style={styles.submitContainer} onPress={handleAnswerSubmit}>
                        <Text style={styles.submitText}>
                        {getTrans('221')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
};

const useStyle = (language) => {
    const { width, height } = useWindowDimensions();
    const SCREEN_WIDTH = width;
    const SCREEN_HEIGHT = height;
    const aspect = width / height;

    //console.log('lang: ' + language)

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
            backgroundColor: 'rgba(0,0,0,0.6)',
            height: SCREEN_HEIGHT * 2,
            width: SCREEN_WIDTH * 2,
            zIndex: 1,
        },
        container: {
            position: 'absolute',
            top: aspect > 4 / 3 ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.6,
            height: aspect > 4 / 3 ? '80%' : '60%',
            width: SCREEN_WIDTH * 0.6,
            backgroundColor: '#FF5733',
            borderRadius: SCREEN_HEIGHT > 720 ? 15 : 10,
            padding: SCREEN_HEIGHT > 720 ? 50 : 30,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: 2,
        },
        inputContainer: {
            backgroundColor: 'white',
            flexDirection: 'row',
            width: SCREEN_WIDTH * 0.3,
            margin: SCREEN_HEIGHT > 720 ? 10 : 0,
            height: SCREEN_HEIGHT > 720 ? 50 : 35,
            borderRadius: SCREEN_HEIGHT > 720 ? 10 : 5,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
        },
        customNumberInput: {
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'gray',
            width: SCREEN_HEIGHT > 720 ? 75 : 50,
            height: SCREEN_HEIGHT > 720 ? 75 : 50,
            borderRadius: SCREEN_HEIGHT > 720 ? 10 : 5,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
        },
        customNumberText: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        numbersContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: SCREEN_WIDTH > 1600 ? 'space-around' : 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
        },
        messageContainer: {
            backgroundColor: "white",
            width: '100%',
            padding: '6%',
            marginBottom: SCREEN_HEIGHT > 720 ? 10 : 0,
        },
        messageText: {
            fontSize: SCREEN_HEIGHT > 720 ? 32 : 20,
            textAlign: 'center',
            fontFamily: getFontFamily(),
        },
        problemContainer: {
            alignItems: 'center',
        },
        problemText: {
            color: 'white',
            fontSize: SCREEN_HEIGHT > 720 ? 25 : 20,
            fontWeight: 'bold',
            marginBottom: 10,
            fontStyle: 'white',
            fontFamily: getFontFamily(),
        },
        input: {
            fontSize: SCREEN_HEIGHT > 720 ? 45 : 24,
            height: '100%',
            textAlign: 'center',
        },
        submitContainer: {
            justifyContent: 'center',
            left: '35%',
            height: 60,
            width: 200,
            marginTop: SCREEN_HEIGHT > 720 ? 12 : -6,
            borderRadius: 30,
            backgroundColor: 'white',
        },
        submitText: {
            alignSelf: 'center',
            color: 'blue',
            fontSize: SCREEN_HEIGHT > 720 ? 23 : 19,
            fontFamily: getFontFamily(),
        }
    });

    return { styles };
};

export default VerificationPopup;