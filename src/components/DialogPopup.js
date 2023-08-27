import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { transMem } from "../data/TransMem.js";

const DialogPopup = (props) => {
    const language = props.language;
    const { styles } = useStyle(language);
    const [showSlider, setShowSlider] = useState(false);
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

    const handleAnswerSubmit = () => {
        props.onResult(true);
        setShowSlider(false);
    };

    const closeSlider = () => {
        //console.log('closed slider');
        props.onResult(true);
        setShowSlider(false);
    };

    return (
        <>
            <TouchableWithoutFeedback onPress={closeSlider}>
                <View style={styles.bgFade}></View>
            </TouchableWithoutFeedback>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        {getTrans(props.titleCode)}
                    </Text>
                </View>
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{getTrans(props.messageCode)}</Text>
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
        numbersContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
        },
        titleContainer: {
            backgroundColor: "white",
            width: '100%',
            padding: '6%',
            marginBottom: SCREEN_HEIGHT > 720 ? 10 : 0,
        },
        titleText: {
            textAlign: 'center',
            fontSize: SCREEN_HEIGHT > 720 ? 32 : 20,
            fontFamily: getFontFamily(),
        },
        messageContainer: {
            paddingTop: SCREEN_HEIGHT > 720 ? 20 : 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        messageText: {
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
            left: 0,
            height: 60,
            width: 200,
            marginTop: SCREEN_HEIGHT > 720 ? 20 : 15,
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

export default DialogPopup;