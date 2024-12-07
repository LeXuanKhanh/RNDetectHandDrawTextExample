A React Native Example which using Digital Ink Recognition and Text Recognition to detect handraw text

Required React Native Library:

- @benjeau/react-native-draw: drawing view
- React-native-view-shot: Capture drawing view to image for Text Recogniton (not Digital Ink Recognition)

<img title="" src="image/ios.gif" alt="" width="300" data-align="inline">

<img title="" src="image/android.gif" alt="" width="300" data-align="inline">

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

Due to the Turbo Modules's difficulty of writing in Swift, for now we have to add Swift files by hand

Run `pod install`

Open `ios/RNDetectHandDrawTextExample.xcworkspace`
in Project Stucture, go to Pods/Development Pods/rn-ml-kit-text-recognition and expand it like this. At first, it will not have Swift file

<img title="" src="image/img1.png" alt="" width="400" data-align="inline">

Right click on ios -> Add file to Pods -> Choose the Swift file (TextRecognition.swift).

Xcode will promp whether you want to add bridging header, accept it

Remember to check its target member ship if in belong to `rn-ml-kit-text-recognition`. It's on the right corner pannel when you are at TextRecognition.swift file

<img title="" src="image/img2.png" alt="" width="400" data-align="inline">

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
