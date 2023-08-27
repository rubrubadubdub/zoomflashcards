import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

const TopMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const height = Dimensions.get('window').height;
  const menuHeight = height / 6;
  const translateY = useState(new Animated.Value(-menuHeight))[0];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(translateY, {
      toValue: menuOpen ? -menuHeight : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderEnd: (_, gestureState) => {
      if (gestureState.dy > 50) {
        toggleMenu();
      }
    },
  });

  return (
    <Animated.View
      style={[
        styles.menuContainer,
        { transform: [{ translateY: translateY }] },
      ]}
    >
      <TouchableOpacity
        {...panResponder.panHandlers}
        onPress={toggleMenu}
        style={[styles.pullDownTab,{opacity: !menuOpen ? 0.1 : 1, top: !menuOpen ? (height > 1000 ? 200 : 150) : (height > 1000 ? 160 : 120) ,}]}
      >
      { !menuOpen ? (
        <Text style={styles.pullDownArrow}>▼</Text>
      ) : (
        <Text style={styles.pullDownArrow}>▲</Text>
      )}
      </TouchableOpacity>
      <View style={styles.menuItems}>
        <Text style={styles.menuItem}>Home</Text>
        <Text style={styles.menuItem}>Sound</Text>
        <Text style={styles.menuItem}>Randomize</Text>
        <Text style={styles.menuItem}>Auto Play</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height:'15%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },
  pullDownTab: {
    backgroundColor: 'black',
    alignSelf: 'center',
    borderRadius: 15,
    //width: 50,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 5,
  },
  pullDownArrow: {
    fontSize: 20,
    color: '#fff',
  },
  menuItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuIcon: {
    alignSelf: 'center',
    height: 30,
    width: 30,
    tintColor: 'white',
  },
  menuItem: {
    fontSize: 16,
    color: '#fff',
    padding: 8,
  },
});

export default TopMenu;
