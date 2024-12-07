/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Canvas, CanvasRef, PathType} from '@benjeau/react-native-draw';
import React, {useRef} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import ViewShot, {captureRef} from 'react-native-view-shot';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  getTextFromPath,
  getTextFromPoints,
  multiply,
} from './modules/rn-ml-kit-text-recognition';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const canvasRef = useRef<CanvasRef>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const convertToText = async (path: string) => {
    if (path.length === 0) {
      return;
    }

    const comps = path.split('/');
    const fileName = comps[comps.length - 1];
    console.log(`ReactNative/${fileName}`);
    const text = await getTextFromPath(`ReactNative/${fileName}`);
    Alert.alert('Alert', `Text recognition: ${text}`);
    // console.log('result from js side: ');
    // console.log(text);
  };

  const convertToPoints = async (path: PathType) => {
    console.log('path');
    const firstPath = path.data[0];
    const points = path.data.map(item => {
      return item.map(
        item1 => [item1[0], item1[1], 0] as [number, number, number],
      );
    });

    const firstPathPoints = firstPath.map(
      item1 => [item1[0], item1[1], 0] as [number, number, number],
    );

    // console.log(points);
    // for (const item of points) {
    //   console.log(item);
    // }
    try {
      const text = await getTextFromPoints(firstPathPoints);
      console.log('result from js side: ');
      console.log(text);
      Alert.alert('Alert', `Detected handraw text: ${text}`);
    } catch (e) {
      console.log(Alert.alert('Alert', `Error in detech handraw: ${e}`));
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <ViewShot ref={viewShotRef}>
          <Canvas
            ref={canvasRef}
            style={{
              backgroundColor: 'white',
              height: 500,
            }}
            height={500}
            color="black"
            thickness={10}
            opacity={1}
            onPathsChange={paths => {
              if (paths.length === 0) {
                return;
              }

              convertToPoints(paths[0]);
            }}
          />
        </ViewShot>
        <View
          style={{
            flexDirection: 'row',
            height: 100,
            justifyContent: 'space-evenly',
          }}>
          <Button title="Clear" onPress={() => canvasRef.current?.clear()} />
          <Button title="Undo" onPress={() => canvasRef.current?.undo()} />
          <Button
            title="Text Recognition"
            onPress={async () => {
              try {
                const uri = await captureRef(viewShotRef, {
                  format: 'png',
                  quality: 1,
                  width: 1080,
                  height: 1080,
                });
                // await CameraRoll.saveAsset(uri, {type: 'photo'});
                console.log(uri);
                convertToText(uri);
                // Alert.alert('Alert', 'Image saved to photo library');
              } catch (error) {
                console.error('Error saving image', error);
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
