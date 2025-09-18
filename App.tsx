// App.tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import GetStampScreen from './src/screens/GetStampScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import CheckInSuccessScreen from './src/screens/CheckInSuccessScreen';
import PassportScreen from './src/screens/PassportScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Root stack param list updated to allow raw param
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  GetStamp: { locationId: string };
  Scan: { locationId: string };
  CheckInSuccess: { raw?: string; location_id?: string; token?: string } | undefined;
  Passport: { justStamped?: boolean; stampedLocationId?: string } | undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GetStamp" component={GetStampScreen} />
          <Stack.Screen name="Scan" component={QRScanScreen} />
          <Stack.Screen name="CheckInSuccess" component={CheckInSuccessScreen} />
          <Stack.Screen name="Passport" component={PassportScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
