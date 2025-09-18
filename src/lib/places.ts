// src/lib/places.ts
// Places and coordinates for the Mysuru map (Leaflet via WebView)

export type Place = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  notes?: string;
};

export const PLACES: Place[] = [
  { id: 'mysore_palace', name: 'Mysore Palace (Amba Vilas)', lat: 12.305199, lng: 76.654549 },
  { id: 'jaganmohan_palace', name: 'Jaganmohan Palace (Art Gallery)', lat: 12.306544, lng: 76.650647 },
  { id: 'lalitha_mahal', name: 'Lalitha Mahal Palace', lat: 12.3059, lng: 76.6498, notes: 'Approximate' },
  { id: 'chamundeshwari_temple', name: 'Chamundeshwari Temple (Chamundi Hill)', lat: 12.3030, lng: 76.6550, notes: 'Approximate summit area' },
  { id: 'brindavan_gardens', name: 'Brindavan Gardens / KRS Dam', lat: 12.42472, lng: 76.57222 },
  { id: 'mysore_zoo', name: 'Mysore Zoo', lat: 12.3008, lng: 76.6677 },
  { id: 'karanji_lake', name: 'Karanji Lake (Nature Park)', lat: 12.3030, lng: 76.6620 },
  { id: 'srirangapatna', name: 'Srirangapatna (Fort / Temples)', lat: 12.4193, lng: 76.6938 },
  { id: 'somnathpur', name: 'Somnathpur – Chennakeshava Temple', lat: 12.272083, lng: 76.875731 },
  { id: 'rail_museum', name: 'Rail Museum, Mysuru', lat: 12.3163, lng: 76.6444, notes: 'Approximate' },
  { id: 'devaraja_market', name: 'Devaraja Market', lat: 12.3108, lng: 76.6510, notes: 'Approximate' },
  { id: 'jayalakshmi_vilas', name: 'Jayalakshmi Vilas Mansion', lat: 12.31365, lng: 76.62232 },
  { id: 'seashell_museum', name: 'Kalashree / Seashell Museum', lat: 12.3056, lng: 76.6485, notes: 'Approximate' },
  { id: 'sand_sculpture_museum', name: 'Mysore Sand Sculpture Museum', lat: 12.3096, lng: 76.6429 },
];

// A reasonable map center around Mysuru city
export const DEFAULT_CENTER = { lat: 12.305199, lng: 76.654549 };
export const DEFAULT_ZOOM = 12;
