// src/lib/locations.ts
// Central source of truth for locations: id, display name, expected token, description, image & video assets.
//
// This single module powers:
// - QR validation (token match)
// - UI (titles + descriptions + images + video paths)
// - Quiz generation (detailed facts about each location)
// - extensibility (add more locations here and UI will follow)

export type LocationFact = {
  mainFeature: string;
  originOfName: string;
  history: string;
  specialty: string;
  famousFact: string;
  culturalSignificance: string;
};

export type Location = {
  id: string;
  name: string;
  token: string; // for prototype, a static token per location; later change to rotating/daily tokens or signed tokens
  description: string;
  image: any; // require(...) asset
  video: any; // require(...) asset OR string URL
  facts?: LocationFact; // Detailed facts for quiz generation
};

const SHARED_VIDEO = require('../../assets/videos/mysore_palace.mp4');

const LOCATIONS: Location[] = [
  {
    id: 'mysore_palace',
    name: 'Mysore Palace (Amba Vilas)',
    token: 'token-mysore_palace',
    description: 'Mysore Palace — the historic and opulent royal palace of Mysuru.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: SHARED_VIDEO,
    facts: {
      mainFeature: 'The Mysore Palace is one of the grandest royal residences in India, featuring Indo-Saracenic architecture with Hindu, Muslim, Gothic, and Rajput influences.',
      originOfName: 'Known as "Amba Vilas Palace", the name originates from the goddess Ambika or Durga, the family deity of the Mysore royal family.',
      history: 'The current palace was built between 1897-1912 after the old wooden palace was destroyed in a fire. It was designed by British architect Henry Irwin.',
      specialty: 'The palace is renowned for its lavish Dasara celebrations, where the golden throne is displayed and the palace is illuminated with nearly 100,000 lights.',
      famousFact: 'The palace houses numerous rare paintings, including those by the celebrated artist Raja Ravi Varma.',
      culturalSignificance: 'It represents the cultural heritage of the Wadiyar dynasty who ruled Mysore for nearly 600 years and were great patrons of art and culture.'
    },
  },
  {
    id: 'jaganmohan_palace',
    name: 'Jaganmohan Palace (Art Gallery)',
    token: 'token-jaganmohan_palace',
    description: 'Art gallery with classic Raja Ravi Varma works.',
    image: require('../../assets/locations/Jaganmohan Palace.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'lalitha_mahal',
    name: 'Lalitha Mahal Palace',
    token: 'token-lalitha_mahal',
    description: 'Lalitha Mahal — grand white palace turned heritage hotel.',
    image: require('../../assets/locations/Lalitha Mahal Palace.png'),
    video: SHARED_VIDEO,
    facts: {
      mainFeature: 'Second largest palace in Mysuru with a striking white façade.',
      originOfName: 'Named after Maharani Lalithadevi.',
      history: 'Built in 1921 to host the Viceroy of India.',
      specialty: 'Now a luxury heritage hotel.',
      famousFact: 'Features an Italian marble staircase and a central dome.',
      culturalSignificance: 'Shows Indo-European architectural fusion of the era.'
    },
  },
  {
    id: 'chamundeshwari_temple',
    name: 'Chamundeshwari Temple (Chamundi Hill)',
    token: 'token-chamundeshwari_temple',
    description: 'Hilltop temple with panoramic city views.',
    image: require('../../assets/locations/Chamundeshwari Temple.png'),
    video: SHARED_VIDEO,
    facts: {
      mainFeature: 'Ancient hilltop temple with seven-story gopuram.',
      originOfName: 'Named after Goddess Chamundeshwari who slew Mahishasura.',
      history: 'Original shrine dates to 12th century; expanded in 17th.',
      specialty: '1,008 stone steps leading to summit.',
      famousFact: 'Large monolithic Nandi statue carved in 1659.',
      culturalSignificance: 'Major pilgrimage site during Dasara.'
    },
  },
  {
    id: 'brindavan_gardens',
    name: 'Brindavan Gardens & Krishnarajasagara Dam',
    token: 'token-brindavan_gardens',
    description: 'Symmetrical terraced gardens with musical fountain.',
    image: require('../../assets/locations/Brindavan Gardens & Krishnarajasagara Dam.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'mysore_zoo',
    name: 'Mysore Zoo',
    token: 'token-mysore_zoo',
    description: 'Historic zoological gardens with diverse fauna.',
    image: require('../../assets/locations/Mysore Zoo.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'karanji_lake',
    name: 'Karanji Lake (Nature Park)',
    token: 'token-karanji_lake',
    description: 'Lake, aviary & butterfly park for nature lovers.',
    image: require('../../assets/locations/Karanji Lake Nature Park  Butterfly Park  Aviary.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'srirangapatna',
    name: 'Srirangapatna (Fort / Temples)',
    token: 'token-srirangapatna',
    description: 'Historic town with Tipu era monuments.',
    image: require('../../assets/locations/Srirangapatna.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'somnathpur',
    name: 'Somnathpur – Chennakeshava Temple',
    token: 'token-somnathpur',
    description: 'Exquisite Hoysala temple carvings.',
    image: require('../../assets/locations/Somnathpur Temple.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'rail_museum',
    name: 'Rail Museum, Mysuru',
    token: 'token-rail_museum',
    description: 'Vintage locomotives & rail heritage.',
    image: require('../../assets/locations/Rail Museum.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'devaraja_market',
    name: 'Devaraja Market',
    token: 'token-devaraja_market',
    description: 'Bustling heritage bazaar of Mysuru.',
    image: require('../../assets/locations/Devaraja Market.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'jayalakshmi_vilas',
    name: 'Jayalakshmi Vilas Mansion',
    token: 'token-jayalakshmi_vilas',
    description: 'Heritage mansion & cultural exhibits.',
    image: require('../../assets/locations/Jayalakshmi Vilas Mansion.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'seashell_museum',
    name: 'Kalashree / Seashell Museum',
    token: 'token-seashell_museum',
    description: 'Unique themed seashell collections.',
    image: require('../../assets/locations/Seashell Museum  Kalashree Seashell Museum.png'),
    video: SHARED_VIDEO,
  },
  {
    id: 'sand_sculpture_museum',
    name: 'Mysore Sand Sculpture Museum',
    token: 'token-sand_sculpture_museum',
    description: 'Creative sand art displays.',
    image: require('../../assets/locations/Chamundeshwari Temple.png'), // placeholder
    video: SHARED_VIDEO,
  },
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
