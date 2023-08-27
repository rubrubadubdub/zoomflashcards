import React, { useRef, useEffect } from 'react';
import { View } from "react-native";
//import SpriteSheet from 'rn-sprite-sheet';
import SpriteSheet from './SpriteSheet';

const Sprite = ( { src, frameCount, refWidth, refHeight, spriteRef } ) => {
  const spriteSheetRef = useRef();

  //setup frames for sprites. Default is 20 frames
  //Default isn't working. Please include 'frames' variable for all animations!
  const frames = () => {
    if(frameCount == null || isNaN(frameCount) || frameCount <= 0){
      return 20 - 1; //20 frames
    }
    //console.log("This sprite has "+frameCount+" frames.");
    return frameCount - 1; //first frame is 0

  }

  const rowNum = () => {
    if(frameCount == null || isNaN(frameCount) || frameCount <= 0){
      return 2; //20 frames
    }

    if(frameCount){
      if(frameCount <= 8){
        return 1;
      } else if(frameCount <= 16){
        //console.log('This sprite has 4 rows');
        return 2;
      } else if(frameCount <= 24){
        //console.log('This sprite has 3 rows');
        return 3;
      } else if(frameCount <= 32){
        //console.log('This sprite has 4 rows');
        return 4;
      } else {
        //console.log('This sprite has 5 rows');
        return 5;
      }
    } else {
      return 2;
    }
  }

  useEffect(() => {
    if (spriteSheetRef.current) {
    handleRest();
    }

    return () => {
        if (spriteSheetRef.current) {
          spriteSheetRef.current.stop(); // Stop the animation when the component is unmounted
        }
      };
  }, []);
  

  const handleRest = () => {
    spriteSheetRef.current.play({
        type: 'rest',
        fps: 1,
        loop: true,
    });
};

  const handleAnimation = () => {
    spriteSheetRef.current.play({
      type: 'anim',
      fps: 12,
      onFinish: handleRest(),
    });
  };

  const handleloop = () => {
    spriteSheetRef.current.play({
      type: 'loop',
      fps: 12,
      loop: true,
    });
  };

  return (

    <SpriteSheet
      ref={spriteRef}
      source={ src }
      columns={8}
      rows={rowNum()}
      animations={{
        rest: [0],
        anim: Array.from({ length: frames() }, (_, index) => index + 1),
        loop: Array.from({ length: frames() }, (_, index) => index + 1),
      }}
      width={ refWidth } // width of a single frame
      height={ refHeight } // height of a single frame
    />

  );
};

export default Sprite;