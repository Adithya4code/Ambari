// src/lib/stamps.ts
// Map place IDs to transparent PNG stamp images and display titles.

export type StampMeta = {
  title: string;
  image: any; // require(...)
};

// NOTE: Add your actual transparent PNG stamp files under assets/stamps/ and
// update the requires below. For now, Mysore Palace uses the available QR image.
const STAMPS: Partial<Record<string, StampMeta>> = {
  mysore_palace: { title: 'Mysore Palace', image: require('../../assets/stamps/mysore_palace.png') },
  jaganmohan_palace: { title: 'Jaganmohan Palace', image: require('../../assets/stamps/jaganmohan_palace.png') },
  lalitha_mahal: { title: 'Lalitha Mahal Palace', image: require('../../assets/stamps/lalitha_mahal.png') },
  chamundeshwari_temple: { title: 'Chamundeshwari Temple', image: require('../../assets/stamps/chamundeshwari_temple.png') },
  brindavan_gardens: { title: 'Brindavan Gardens', image: require('../../assets/stamps/brindavan_gardens.png') },
  mysore_zoo: { title: 'Mysore Zoo', image: require('../../assets/stamps/mysore_zoo.png') },
  karanji_lake: { title: 'Karanji Lake', image: require('../../assets/stamps/karanji_lake.png') },
  srirangapatna: { title: 'Srirangapatna', image: require('../../assets/stamps/srirangapatna.png') },
  somnathpur: { title: 'Somnathpur Temple', image: require('../../assets/stamps/somnathpur.png') },
  rail_museum: { title: 'Rail Museum', image: require('../../assets/stamps/rail_museum.png') },
  devaraja_market: { title: 'Devaraja Market', image: require('../../assets/stamps/devaraja_market.png') },
  jayalakshmi_vilas: { title: 'Jayalakshmi Vilas Mansion', image: require('../../assets/stamps/jayalakshmi_vilas.png') },
  seashell_museum: { title: 'Seashell Museum', image: require('../../assets/stamps/seashell_museum.png') },
};

export function getStamp(id: string): StampMeta | undefined {
  return STAMPS[id];
}
