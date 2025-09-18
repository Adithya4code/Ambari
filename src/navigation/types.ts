// src/navigation/types.ts
// Navigation type definitions

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Scan: { locationId: string };
  CheckInSuccess: { raw?: string; location_id?: string; token?: string } | undefined;
  Profile: undefined;
  Quiz: { locationId: string };
};
