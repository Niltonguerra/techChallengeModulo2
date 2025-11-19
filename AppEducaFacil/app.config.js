import 'dotenv/config'
export default {
  expo: {
  name: "AppEducaFacil",
  slug: "AppEducaFacil",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "appeducafacil",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
    },
  ios: {
    supportsTablet: true
    },
  android: {
    package: "com.niltonguerra.appeducafacil",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
      },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
    },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
    },
  plugins: [
    "expo-router"
    ],
  experiments: {
    typedRoutes: true
    },
  extra: {
    apiUrl: process.env.EXPO_API_URL,
    keyImgBB: process.env.EXPO_KEY_IMGBB,
    imgBB: process.env.EXPO_URL_IMGBB,
    routerAppRoot:process.env.EXPO_ROUTER_APP_ROOT,
    router: {
      appRoot: "app"
    },
    eas: {
      projectId: "99d76f78-8f76-4d73-a0b1-2c6b4bc7d8c8"
    }
    }
  }
}
