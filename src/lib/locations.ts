// src/lib/locations.ts
// Central source of truth for locations: id, display name, expected token, description, image & video assets.
//
// This single module powers:
// - QR validation (token match)
// - UI (titles + descriptions + images + video paths)
// - extensibility (add more locations here and UI will follow)

export type Location = {
  id: string;
  name: string;
  token: string; // for prototype, a static token per location; later change to rotating/daily tokens or signed tokens
  description: string;
  image: any; // require(...) asset
  video: any; // require(...) asset OR string URL
};

const LOCATIONS: Location[] = [
  {
    id: 'mysore_palace',
    name: 'Mysore Palace (Amba Vilas)',
    token: 'token-mysore-palace',
    description: 'Mysore Palace — the historic and opulent royal palace of Mysuru.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
  },
//   {
//     id: 'jaganmohan',
//     name: 'Jaganmohan Palace & Art Gallery',
//     token: 'token-jaganmohan',
//     description: 'Jaganmohan Palace — famous for classical paintings and royal artistry.',
//     image: require('../../assets/locations/jaganmohan.jpg'),
//     video: require('../../assets/videos/jaganmohan.mp4'),
//   },
//   {
//     id: 'lalitha_mahal',
//     name: 'Lalitha Mahal Palace',
//     token: 'token-lalitha-mahal',
//     description: 'Lalitha Mahal — grand palace with British-inspired interiors.',
//     image: require('../../assets/locations/lalitha_mahal.jpg'),
//     video: require('../../assets/videos/lalitha_mahal.mp4'),
//   },
//   {
//     id: 'chamundi_hill',
//     name: 'Chamundeshwari Temple (Chamundi Hill)',
//     token: 'token-chamundi-hill',
//     description: 'Chamundeshwari Temple — hilltop shrine known for panoramic city views.',
//     image: require('../../assets/locations/chamundi_hill.jpg'),
//     video: require('../../assets/videos/chamundi_hill.mp4'),
//   },
//   {
//     id: 'brindavan',
//     name: 'Brindavan Gardens & Krishnarajasagara Dam',
//     token: 'token-brindavan',
//     description: 'Brindavan Gardens — show gardens and illuminated fountains beside KRS dam.',
//     image: require('../../assets/locations/brindavan.jpg'),
//     video: require('../../assets/videos/brindavan.mp4'),
//   },
//   {
//     id: 'mysore_zoo',
//     name: 'Mysore Zoo',
//     token: 'token-mysore-zoo',
//     description: 'Sri Chamarajendra Zoological Gardens — historic zoo with diverse fauna.',
//     image: require('../../assets/locations/mysore_zoo.jpg'),
//     video: require('../../assets/videos/mysore_zoo.mp4'),
//   },
//   {
//     id: 'karanji_lake',
//     name: 'Karanji Lake & Nature Park',
//     token: 'token-karanji-lake',
//     description: 'Karanji Lake — nature park, aviary and butterfly park for birdwatchers.',
//     image: require('../../assets/locations/karanji_lake.jpg'),
//     video: require('../../assets/videos/karanji_lake.mp4'),
//   },
//   {
//     id: 'srirangapatna',
//     name: 'Srirangapatna',
//     token: 'token-srirangapatna',
//     description: 'Srirangapatna — historic fort, Tipu Sultan’s summer palace and temples.',
//     image: require('../../assets/locations/srirangapatna.jpg'),
//     video: require('../../assets/videos/srirangapatna.mp4'),
//   },
//   {
//     id: 'somnathpur',
//     name: 'Somnathpur Temple (Chennakeshava)',
//     token: 'token-somnathpur',
//     description: 'Somnathpur — exquisite Hoysala temple architecture and carvings.',
//     image: require('../../assets/locations/somnathpur.jpg'),
//     video: require('../../assets/videos/somnathpur.mp4'),
//   },
//   {
//     id: 'rail_museum',
//     name: 'Rail Museum, Mysore',
//     token: 'token-rail-museum',
//     description: 'Rail Museum — vintage engines and rail history exhibits.',
//     image: require('../../assets/locations/rail_museum.jpg'),
//     video: require('../../assets/videos/rail_museum.mp4'),
//   },
//   {
//     id: 'devaraja_market',
//     name: 'Devaraja Market (Bazaar)',
//     token: 'token-devaraja-market',
//     description: 'Devaraja Market — bustling bazaar known for flowers, spices and local produce.',
//     image: require('../../assets/locations/devaraja_market.jpg'),
//     video: require('../../assets/videos/devaraja_market.mp4'),
//   },
//   {
//     id: 'jayalakshmi_vilas',
//     name: 'Jayalakshmi Vilas Mansion',
//     token: 'token-jayalakshmi-vilas',
//     description: 'Jayalakshmi Vilas — heritage mansion and cultural exhibitions.',
//     image: require('../../assets/locations/jayalakshmi_vilas.jpg'),
//     video: require('../../assets/videos/jayalakshmi_vilas.mp4'),
//   },
//   {
//     id: 'seashell_museum',
//     name: 'Seashell / Kalashree Museum',
//     token: 'token-seashell-museum',
//     description: 'Seashell Museum — unique collection of rare seashells and exhibits.',
//     image: require('../../assets/locations/seashell_museum.jpg'),
//     video: require('../../assets/videos/seashell_museum.mp4'),
//   },
//   {
//     id: 'sand_sculpture_museum',
//     name: 'Sand Sculpture Museum',
//     token: 'token-sand-sculpture',
//     description: 'Sand Sculpture Museum — creative sand art near Chamundi Hills base.',
//     image: require('../../assets/locations/sand_sculpture_museum.jpg'),
//     video: require('../../assets/videos/sand_sculpture_museum.mp4'),
//   },
];

export function getLocationById(id?: string): Location | undefined {
  if (!id) return undefined;
  return LOCATIONS.find((l) => l.id === id);
}

/**
 * Validate scanned data. Expected scan formats:
 * - A URL with query params: https://mysuru.example/checkin?location_id=mysore_palace&token=token-...
 * - Or the raw string "mysore_palace|token-mysore-palace" (fallback)
 *
 * Returns details { ok, location, reason } where ok=true when token matches location token.
 */
export function validateScanData(raw: string) {
  // try parse as URL first
  try {
    const url = new URL(raw);
    const location_id = url.searchParams.get('location_id') ?? undefined;
    const token = url.searchParams.get('token') ?? undefined;
    if (!location_id) return { ok: false, reason: 'missing_location_id' };
    const location = getLocationById(location_id);
    if (!location) return { ok: false, reason: 'unknown_location' };
    if (!token) return { ok: false, reason: 'missing_token' };
    if (token !== location.token) return { ok: false, location, reason: 'invalid_token' };
    return { ok: true, location, reason: 'ok' };
  } catch (e) {
    // fallback parse `id|token`
    if (raw.includes('|')) {
      const [location_id, token] = raw.split('|').map((s) => s.trim());
      const location = getLocationById(location_id);
      if (!location) return { ok: false, reason: 'unknown_location' };
      if (!token) return { ok: false, location, reason: 'missing_token' };
      if (token !== location.token) return { ok: false, location, reason: 'invalid_token' };
      return { ok: true, location, reason: 'ok' };
    }
    return { ok: false, reason: 'unrecognized_format' };
  }
}

export { LOCATIONS };
