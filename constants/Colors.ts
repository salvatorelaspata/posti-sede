/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorDark = '#fff';
const tintColorDark2 = '#fff';
const tintColorDark3 = '#fff';

const tintColorLight = '#0a7ea4';
const tintColorLight2 = '#2094c7';
const tintColorLight3 = '#50b9e9';

const tintColorLightHeader = '#2196F8';
const tintColorLightHeader2 = '#4CAF50';

const tintColorDarkHeader = '#2196F8';
const tintColorDarkHeader2 = '#4CAF50';

export const Colors = {
  light: {
    text: '#11181C',
    whiteText: '#fff',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gradient: [tintColorLight, tintColorLight2, tintColorLight3] as const,
    gradientHeader: [tintColorLightHeader, tintColorLightHeader2] as const,
  },
  dark: {
    text: '#ECEDEE',
    whiteText: '#fff',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gradient: [tintColorDark, tintColorDark2, tintColorDark3] as const,
    gradientHeader: [tintColorDarkHeader, tintColorDarkHeader2] as const,
  },
  primary: '#6200ee',
  gray: '#a9a9a9',
};

