import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}

// export default function RootLayout() {
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ThemeProvider value={DarkTheme}>

//       {/* <StatusBar style="auto" /> */}
//     </ThemeProvider>
//   );
// }
