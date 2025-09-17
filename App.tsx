// App.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// font loader from expo google fonts
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Screens (we will add these files below)
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import CheckInSuccessScreen from './src/screens/CheckInSuccessScreen';

// Root stack param types (light typing for navigation)
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Scan: undefined;
  CheckInSuccess: { location_id?: string; token?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // load fonts once at app bootstrap
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    // keep app from rendering before fonts are ready to avoid layout jank
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    // SafeAreaProvider provides correct insets across devices (statusbar / notch handling)
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Scan" component={QRScanScreen} />
          <Stack.Screen name="CheckInSuccess" component={CheckInSuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
