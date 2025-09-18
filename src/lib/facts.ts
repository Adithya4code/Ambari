// src/lib/facts.ts
// Fun facts for each place keyed by id (matching src/lib/places.ts ids)

export const FACTS: Record<string, string> = {
  mysore_palace:
    'Mysore Palace (Amba Vilas) – It’s illuminated with nearly 100,000 light bulbs during special occasions, creating a dazzling sight visible across the city.',
  jaganmohan_palace:
    'Jaganmohan Palace + Art Gallery – Houses one of the largest collections of Raja Ravi Varma’s paintings, making it a cultural treasure.',
  lalitha_mahal:
    'Lalitha Mahal Palace – Built for royal guests, it once hosted the Viceroy of India; today it’s a luxury heritage hotel with a grand ballroom inspired by St. Paul’s Cathedral, London.',
  chamundeshwari_temple:
    'Chamundeshwari Temple (Chamundi Hill) – The hill has a giant Nandi statue carved from a single granite block, one of the largest in India.',
  brindavan_gardens:
    'Brindavan Gardens & Krishnarajasagara Dam – The gardens are famous for their musical fountain, among the earliest dancing fountains in India.',
  mysore_zoo:
    'Mysore Zoo (Sri Chamarajendra Zoological Gardens) – One of the oldest zoos in India (founded in 1892), it was the first in the country to house gorillas and penguins.',
  karanji_lake:
    'Karanji Lake + Nature Park / Butterfly Park / Aviary – Its aviary is the largest walk-through aviary in India, where visitors can walk among free-flying birds.',
  srirangapatna:
    'Srirangapatna (Fort, Tipu Sultan’s Summer Palace, Ranganathaswamy Temple) – The fort walls still show cannonball marks from battles with the British.',
  somnathpur:
    'Somnathpur Temple (Chennakeshava Temple) – The temple has over 600 celestial maidens (Madanikas) intricately carved, each in a unique pose.',
  rail_museum:
    'Rail Museum, Mysore – It houses India’s first steam engine locomotive, built in 1925, still preserved.',
  devaraja_market:
    'Devaraja Market (bazaar) – This 100+ year-old market is famous for Mysore Mallige (jasmine), a flower with a unique fragrance linked to Mysuru’s identity.',
  jayalakshmi_vilas:
    'Jayalakshmi Vilas Mansion – It has an interesting history: once abandoned, it was restored and now houses a folklore museum with over 6,500 artifacts.',
  seashell_museum:
    'Seashell Museum / Kalashree Seashell Museum – The artist built intricate models of famous monuments (like Taj Mahal) using only seashells, without any paint or glue.',
  sand_sculpture_museum:
    'Sand Sculpture Museum (Chamundi Hills base) – It is India’s first sand sculpture museum, with around 150 works made from 115 truckloads of sand.',
};

export function getFact(id: string): string | undefined {
  return FACTS[id];
}
