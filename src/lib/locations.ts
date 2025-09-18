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

const LOCATIONS: Location[] = [
  {
    id: 'mysore_palace',
    name: 'Mysore Palace (Amba Vilas)',
    token: 'token-mysore-palace',
    description: 'Mysore Palace — the historic and opulent royal palace of Mysuru.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
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
    token: 'token-jaganmohan',
    description: 'Jaganmohan Palace — famous for classical paintings and royal artistry.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
    facts: {
      mainFeature: 'A magnificent royal palace that now houses one of the largest collections of artifacts and paintings in South India.',
      originOfName: 'Jaganmohan means "Pleasing to the World" in Sanskrit. It was named by the Wadiyar rulers as a place that would bring joy to the public.',
      history: 'Built in 1861 by Krishnaraja Wadiyar III as an alternate residence when the main Mysore Palace was being rebuilt after a fire.',
      specialty: 'The art gallery contains paintings by the renowned artist Raja Ravi Varma and traditional Mysore style paintings with gold leaf work.',
      famousFact: 'It served as the royal court (durbar) of the Wadiyars and temporarily housed the royal family until the new palace was completed.',
      culturalSignificance: 'The auditorium in the palace hosted the first ever session of the Karnataka Representative Assembly (Praja Pratinidhi Sabha) in 1881.'
    },
  },
  {
    id: 'lalitha_mahal',
    name: 'Lalitha Mahal Palace',
    token: 'token-lalitha-mahal',
    description: 'Lalitha Mahal — grand palace with British-inspired interiors.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
    facts: {
      mainFeature: 'The second largest palace in Mysore, painted pristine white with a striking resemblance to St. Paul\'s Cathedral in London.',
      originOfName: 'Named after Maharani Lalithadevi, the wife of Maharaja Krishnaraja Wadiyar IV who commissioned the palace.',
      history: 'Built in 1921 by Maharaja Krishnaraja Wadiyar IV to host the viceroy of India and other distinguished British guests.',
      specialty: 'Now a luxury heritage hotel operated by the WelcomHeritage group, allowing guests to experience royal living.',
      famousFact: 'Features a central dome reminiscent of St. Paul\'s Cathedral in London, with a viceroy room and an Italian marble staircase.',
      culturalSignificance: 'Represents the Indo-European architectural fusion during the British Raj, showcasing the royal family\'s cosmopolitan tastes.'
    },
  },
  {
    id: 'chamundeshwari_temple',
    name: 'Chamundeshwari Temple (Chamundi Hill)',
    token: 'token-chamundi-hill',
    description: 'Chamundeshwari Temple — hilltop shrine known for panoramic city views.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
    facts: {
      mainFeature: 'Ancient hilltop temple with a seven-story gopuram (tower) dedicated to Goddess Chamundeshwari, the tutelary deity of the Mysore royal family.',
      originOfName: 'Named after the fierce form of Goddess Durga who slew the demon Mahishasura, from which Mysuru (Mysore) gets its name.',
      history: 'The original shrine dates back to the 12th century, while the main temple structure was built in the 17th century by the Wodeyar king Dodda Devaraja.',
      specialty: 'The 1,008 steps carved into the stone that lead to the temple summit, representing the journey of spiritual ascension.',
      famousFact: "The temple houses a 5-foot-tall statue of Nandi (Lord Shiva's mount) carved out of a single block of granite in 1659.",
      culturalSignificance: 'A major pilgrimage site during Dasara festival when the idol of Goddess Chamundeshwari is carried in a golden howdah during processions.'
    },
  },
  {
    id: 'brindavan',
    name: 'Brindavan Gardens & Krishnarajasagara Dam',
    token: 'token-brindavan',
    description: 'Brindavan Gardens — show gardens and illuminated fountains beside KRS dam.',
    image: require('../../assets/locations/mysore_palace.png'),
    video: require('../../assets/videos/mysore_palace.mp4'),
    facts: {
      mainFeature: 'Terraced ornamental garden with symmetric design, cascading fountains and musical fountain light shows that attract tourists from around the world.',
      originOfName: 'Named after the legendary Brindavan garden where Lord Krishna spent his childhood, signifying a place of divine beauty and joy.',
      history: 'Built in 1932 alongside the Krishnarajasagara Dam during the reign of Maharaja Krishnaraja Wadiyar IV, designed by chief engineer Sir M. Visvesvaraya.',
      specialty: 'The illuminated musical fountain show in the evenings with synchronized water jets, music, and colored lights creating captivating displays.',
      famousFact: 'The garden was featured in many classic Bollywood and South Indian films, making it an iconic location in Indian cinema.',
      culturalSignificance: 'Represents the engineering marvel and aesthetic vision of modern Mysore, combining utility (irrigation) with beauty (tourism).'
    },
  },
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
