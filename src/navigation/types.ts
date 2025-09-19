// src/navigation/types.ts
// Navigation type definitions

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Scan: { locationId: string };
  GetStamp: { locationId: string };
  CheckInSuccess: { raw?: string; location_id?: string; token?: string } | undefined;
  Passport: { justStamped?: boolean; stampedLocationId?: string } | undefined;
  Profile: undefined;
  Quiz: { locationId: string } | undefined; // allow optional for generic quiz landing
};
