import { ConfigContext, ExpoConfig } from "expo/config"

const IS_DEV = process.env.APP_VARIANT === "development"
const IS_PREVIEW = process.env.APP_VARIANT === "preview"

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.salvatorelaspata.postisede.dev';
  }

  if (IS_PREVIEW) {
    return 'com.salvatorelaspata.postisede.preview';
  }

  return 'com.salvatorelaspata.postisede';
};

const getAppName = () => {
  if (IS_DEV)
    return 'Posti Sede (Dev)';

  if (IS_PREVIEW)
    return 'Posti Sede (Preview)';

  return 'Posti Sede';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  "name": getAppName(),
  "slug": "posti-sede",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": getUniqueIdentifier(),
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": getUniqueIdentifier()
  },
  "web": {
    "bundler": "metro",
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ],
    "expo-secure-store"
  ],
  "experiments": {
    "typedRoutes": true
  },
  "extra": {
    "router": {
      "origin": false
    },
    "eas": {
      "projectId": "9f85a268-c4f6-4d61-af21-cafdc2388372"
    }
  }
})