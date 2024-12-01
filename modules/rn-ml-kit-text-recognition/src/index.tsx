import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR =
  `The package 'rn-ml-kit-text-recognition' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RnMlKitTextRecognitionModule = isTurboModuleEnabled
  ? require('./NativeRnMlKitTextRecognition').default
  : NativeModules.RnMlKitTextRecognition;

const RnMlKitTextRecognition = RnMlKitTextRecognitionModule
  ? RnMlKitTextRecognitionModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function multiply(a: number, b: number): Promise<number> {
  return RnMlKitTextRecognition.multiply(a, b);
}

export function getTextFromPath(path: string): Promise<number> {
  return RnMlKitTextRecognition.getTextFromPath(path);
}
