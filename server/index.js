import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'ambari';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Create server/.env based on server/.env.example');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

let client;
let db;

async function connectDb() {
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(MONGODB_DB);
}

const PLACES_COLLECTION = 'places';
const CHECKINS_COLLECTION = 'checkins';

// Schema shape (documented):
// Place: {
//   _id: ObjectId,
//   title: string,
//   latitude: number,
//   longitude: number,
//   badgeUrl: string,    // URL to badge icon for passport stamp
//   tagCode: string,     // short code for NFC/tag association
//   qrToken: string,     // token embedded in generated QR for validation
//   description?: string // optional
// }
// Checkin: {
//   _id: ObjectId,
//   placeId: ObjectId,   // ref to places _id
//   tagCode?: string,
//   qrToken?: string,
//   createdAt: Date,
//   userId?: string      // optional user identifier (not implemented now)
// }

async function seedIfEmpty() {
  const col = db.collection(PLACES_COLLECTION);
  const count = await col.countDocuments();
  if (count > 0) return;
  const seed = [
    { title: 'Mysore Palace (Amba Vilas)', latitude: 12.305199, longitude: 76.654549, badgeUrl: 'https://example.com/badges/mysore-palace.png', tagCode: 'TAG-MYSPAL', qrToken: 'QR-MYSPAL-001' },
    { title: 'Jaganmohan Palace (Art Gallery)', latitude: 12.306544, longitude: 76.650647, badgeUrl: 'https://example.com/badges/jaganmohan.png', tagCode: 'TAG-JAGPAL', qrToken: 'QR-JAGPAL-001' },
    { title: 'Lalitha Mahal Palace', latitude: 12.3059, longitude: 76.6498, badgeUrl: 'https://example.com/badges/lalitha-mahal.png', tagCode: 'TAG-LALMAH', qrToken: 'QR-LALMAH-001' },
    { title: 'Chamundeshwari Temple (Chamundi Hill)', latitude: 12.303, longitude: 76.655, badgeUrl: 'https://example.com/badges/chamundeshwari-temple.png', tagCode: 'TAG-CHAMUN', qrToken: 'QR-CHAMUN-001' },
    { title: 'Brindavan Gardens / KRS Dam', latitude: 12.42472, longitude: 76.57222, badgeUrl: 'https://example.com/badges/brindavan-gardens.png', tagCode: 'TAG-BRINDA', qrToken: 'QR-BRINDA-001' },
    { title: 'Mysore Zoo', latitude: 12.3008, longitude: 76.6677, badgeUrl: 'https://example.com/badges/mysore-zoo.png', tagCode: 'TAG-ZOO', qrToken: 'QR-ZOO-001' },
    { title: 'Karanji Lake (Nature Park)', latitude: 12.303, longitude: 76.662, badgeUrl: 'https://example.com/badges/karanji-lake.png', tagCode: 'TAG-KARLAK', qrToken: 'QR-KARLAK-001' },
    { title: 'Srirangapatna (Fort / Temples)', latitude: 12.4193, longitude: 76.6938, badgeUrl: 'https://example.com/badges/srirangapatna.png', tagCode: 'TAG-SRIRAN', qrToken: 'QR-SRIRAN-001' },
    { title: 'Somnathpur – Chennakeshava Temple', latitude: 12.272083, longitude: 76.875731, badgeUrl: 'https://example.com/badges/somnathpur.png', tagCode: 'TAG-SOMNAT', qrToken: 'QR-SOMNAT-001' },
    { title: 'Rail Museum, Mysuru', latitude: 12.3163, longitude: 76.6444, badgeUrl: 'https://example.com/badges/rail-museum.png', tagCode: 'TAG-RAILMU', qrToken: 'QR-RAILMU-001' },
    { title: 'Devaraja Market', latitude: 12.3108, longitude: 76.651, badgeUrl: 'https://example.com/badges/devaraja-market.png', tagCode: 'TAG-DEVMAK', qrToken: 'QR-DEVMAK-001' },
    { title: 'Jayalakshmi Vilas Mansion', latitude: 12.31365, longitude: 76.62232, badgeUrl: 'https://example.com/badges/jayalakshmi-vilas.png', tagCode: 'TAG-JAYVIL', qrToken: 'QR-JAYVIL-001' },
    { title: 'Kalashree / Seashell Museum', latitude: 12.3056, longitude: 76.6485, badgeUrl: 'https://example.com/badges/seashell-museum.png', tagCode: 'TAG-SEASHE', qrToken: 'QR-SEASHE-001' },
    { title: 'Mysore Sand Sculpture Museum', latitude: 12.3096, longitude: 76.6429, badgeUrl: 'https://example.com/badges/sand-sculpture-museum.png', tagCode: 'TAG-SANDMU', qrToken: 'QR-SANDMU-001' }
  ];
  await col.insertMany(seed.map((s) => ({ ...s })));
  console.log(`Seeded ${seed.length} places.`);
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/places', async (req, res) => {
  try {
    const places = await db.collection(PLACES_COLLECTION)
      .find({}, { projection: { title: 1, latitude: 1, longitude: 1, badgeUrl: 1, tagCode: 1 } })
      .toArray();
    res.json(places.map(p => ({
      id: p._id.toString(),
      title: p.title,
      latitude: p.latitude,
      longitude: p.longitude,
      badgeUrl: p.badgeUrl,
      tagCode: p.tagCode,
    })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_fetch_places' });
  }
});

// Validate endpoints
// - POST /api/validate/qr { placeId, qrToken }
// - POST /api/validate/tag { placeId, tagCode }
app.post('/api/validate/qr', async (req, res) => {
  const { placeId, qrToken } = req.body || {};
  if (!placeId || !qrToken) return res.status(400).json({ ok: false, reason: 'missing_params' });
  try {
    const place = await db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectId(placeId), qrToken });
    if (!place) return res.status(200).json({ ok: false, reason: 'invalid_qr' });
    await db.collection(CHECKINS_COLLECTION).insertOne({ placeId: place._id, qrToken, createdAt: new Date() });
    res.json({ ok: true, placeId: placeId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, reason: 'server_error' });
  }
});

app.post('/api/validate/tag', async (req, res) => {
  const { placeId, tagCode } = req.body || {};
  if (!placeId || !tagCode) return res.status(400).json({ ok: false, reason: 'missing_params' });
  try {
    const place = await db.collection(PLACES_COLLECTION).findOne({ _id: new ObjectId(placeId), tagCode });
    if (!place) return res.status(200).json({ ok: false, reason: 'invalid_tag' });
    await db.collection(CHECKINS_COLLECTION).insertOne({ placeId: place._id, tagCode, createdAt: new Date() });
    res.json({ ok: true, placeId: placeId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, reason: 'server_error' });
  }
});

app.listen(PORT, async () => {
  try {
    await connectDb();
    await seedIfEmpty();
    console.log(`Ambari server listening on http://localhost:${PORT}`);
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
});
