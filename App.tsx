/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {Canvas, CanvasRef, PathType} from '@benjeau/react-native-draw';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ViewShot, {captureRef} from 'react-native-view-shot';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  getTextFromPath,
  getTextFromPoints,
  multiply,
} from './modules/rn-ml-kit-text-recognition/src';

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
    console.log('result from js side: ');
    console.log(text);
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

    //sconsole.log(points);
    // for (const item of points) {
    //   console.log(item);
    // }

    const text = await getTextFromPoints(firstPathPoints);
    console.log('result from js side: ');
    console.log(text);
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
            title="Detect"
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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
