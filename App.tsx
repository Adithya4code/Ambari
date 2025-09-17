// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScanScreen from './src/screens/QRScanScreen';
import CheckInSuccessScreen from './src/screens/CheckInSuccessScreen';

// Types for navigation (keeps TS inline and reusable)
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Scan: undefined;
  CheckInSuccess: { location_id?: string; token?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={QRScanScreen} />
        <Stack.Screen name="CheckInSuccess" component={CheckInSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
