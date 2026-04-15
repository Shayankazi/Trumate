import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ─── Inline Models (avoid import issues with .js extensions) ──────────────────

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  role: { type: String, enum: ['owner', 'seeker'], required: true },
  major: { type: String },
  college: { type: String },
  year: { type: String },
  interests: [{ type: String }],
  location: { city: { type: String, required: true }, coordinates: { type: [Number], required: true } },
  rent: { type: Number },
  bio: { type: String },
  images: [{ type: String }],
  preferences: {
    smoking: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    sleep_schedule: { type: String, default: 'early_bird' },
    cleanliness: { type: String, default: 'medium' },
    gaming: { type: Boolean, default: false },
    guests: { type: Boolean, default: true },
    pets: { type: String, default: 'no' },
    diet: { type: String, default: 'anything' },
  },
  is_online: { type: Boolean, default: false },
  last_active: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

const MatchSchema = new mongoose.Schema({
  user1_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user2_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  compatibility_score: { type: Number, default: 0 },
  matched_at: { type: Date },
  is_active: { type: Boolean, default: true },
});

const SwipeSchema = new mongoose.Schema({
  swiper_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  swiped_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String },
  created_at: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  match_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
});

const LikeSchema = new mongoose.Schema({
  from_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  created_at: { type: Date, default: Date.now },
});

const User    = mongoose.model('User',    UserSchema);
const Match   = mongoose.model('Match',   MatchSchema);
const Swipe   = mongoose.model('Swipe',   SwipeSchema);
const Message = mongoose.model('Message', MessageSchema);
const Like    = mongoose.model('Like',    LikeSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const HASH = await bcrypt.hash('Test@1234', 10);

const puneLocations = [
  { city: 'Katraj, Pune',         coords: [73.8553, 18.4529] },
  { city: 'Kondhwa, Pune',        coords: [73.8755, 18.4707] },
  { city: 'Bibwewadi, Pune',      coords: [73.8490, 18.4762] },
  { city: 'Dhankawadi, Pune',     coords: [73.8602, 18.4613] },
  { city: 'Warje, Pune',          coords: [73.8120, 18.4895] },
  { city: 'Kothrud, Pune',        coords: [73.8125, 18.5074] },
  { city: 'Deccan, Pune',         coords: [73.8402, 18.5168] },
  { city: 'Shivajinagar, Pune',   coords: [73.8367, 18.5308] },
  { city: 'Baner, Pune',          coords: [73.7893, 18.5590] },
  { city: 'Hinjawadi, Pune',      coords: [73.7380, 18.5914] },
  { city: 'Viman Nagar, Pune',    coords: [73.9147, 18.5679] },
  { city: 'Kalyani Nagar, Pune',  coords: [73.9041, 18.5469] },
  { city: 'Kharadi, Pune',        coords: [73.9483, 18.5528] },
  { city: 'Wakad, Pune',          coords: [73.7612, 18.5981] },
  { city: 'Pimpri, Pune',         coords: [73.8063, 18.6279] },
  { city: 'Chinchwad, Pune',      coords: [73.7989, 18.6441] },
  { city: 'Aundh, Pune',          coords: [73.8139, 18.5588] },
  { city: 'Balewadi, Pune',       coords: [73.7867, 18.5727] },
  { city: 'Hadapsar, Pune',       coords: [73.9344, 18.5021] },
  { city: 'Mundwa, Pune',         coords: [73.9098, 18.5301] },
];

const colleges = [
  'MIT World Peace University',
  'Pune Institute of Computer Technology (PICT)',
  'College of Engineering Pune (COEP)',
  'Symbiosis Institute of Technology',
  'Sinhgad College of Engineering',
  'DY Patil College of Engineering',
  'Bharati Vidyapeeth College of Engineering',
  'JSPM Rajarshi Shahu College',
  'VIT Pune',
  'G.H. Raisoni College of Engineering',
];

const majors = [
  'Computer Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Electronics & Telecommunication',
  'Civil Engineering',
  'Data Science',
  'Artificial Intelligence & ML',
  'Electrical Engineering',
  'MBA (Finance)',
  'Chemical Engineering',
];

const years = ['First Year', 'Second Year', 'Third Year', 'Final Year'];

const interestPool = [
  'Cricket', 'Coding', 'Music', 'Gaming', 'Fitness',
  'Movies', 'Cooking', 'Photography', 'Reading', 'Hiking',
  'Travel', 'Yoga', 'Anime', 'Football', 'Chess',
  'Badminton', 'Dancing', 'Art', 'Podcasts', 'Cycling',
];

const diets = ['anything', 'vegetarian', 'non_veg', 'vegan'] as const;
const sleeps = ['early_bird', 'night_owl'] as const;
const cleanlines = ['low', 'medium', 'high'] as const;
const petsOpts = ['no', 'yes', 'love_them'] as const;

function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN<T>(arr: T[], n: number): T[] {
  const copy = [...arr].sort(() => Math.random() - 0.5);
  return copy.slice(0, n);
}

// ─── 25 Seekers ───────────────────────────────────────────────────────────────
const seekerData = [
  { name: 'Arjun Sharma',       age: 21, gender: 'Man',    img: 'men/11' },
  { name: 'Rahul Verma',        age: 22, gender: 'Man',    img: 'men/12' },
  { name: 'Karthik Iyer',       age: 20, gender: 'Man',    img: 'men/13' },
  { name: 'Vivek Patil',        age: 23, gender: 'Man',    img: 'men/14' },
  { name: 'Rohan Desai',        age: 21, gender: 'Man',    img: 'men/15' },
  { name: 'Nikhil Joshi',       age: 22, gender: 'Man',    img: 'men/16' },
  { name: 'Aditya Kumar',       age: 20, gender: 'Man',    img: 'men/17' },
  { name: 'Siddharth Nair',     age: 22, gender: 'Man',    img: 'men/18' },
  { name: 'Pranav Singh',       age: 21, gender: 'Man',    img: 'men/19' },
  { name: 'Ankit Mishra',       age: 23, gender: 'Man',    img: 'men/20' },
  { name: 'Harsh Patel',        age: 20, gender: 'Man',    img: 'men/21' },
  { name: 'Yash Gupta',         age: 22, gender: 'Man',    img: 'men/22' },
  { name: 'Priya Sharma',       age: 21, gender: 'Woman',  img: 'women/11' },
  { name: 'Sneha Patil',        age: 22, gender: 'Woman',  img: 'women/12' },
  { name: 'Ananya Iyer',        age: 20, gender: 'Woman',  img: 'women/13' },
  { name: 'Pooja Desai',        age: 23, gender: 'Woman',  img: 'women/14' },
  { name: 'Nisha Joshi',        age: 21, gender: 'Woman',  img: 'women/15' },
  { name: 'Kavita Rao',         age: 22, gender: 'Woman',  img: 'women/16' },
  { name: 'Riya Nair',          age: 20, gender: 'Woman',  img: 'women/17' },
  { name: 'Sakshi Singh',       age: 22, gender: 'Woman',  img: 'women/18' },
  { name: 'Divya Mehta',        age: 21, gender: 'Woman',  img: 'women/19' },
  { name: 'Shreya Rao',         age: 23, gender: 'Woman',  img: 'women/20' },
  { name: 'Neha Tiwari',        age: 20, gender: 'Woman',  img: 'women/21' },
  { name: 'Meghna Patel',       age: 22, gender: 'Woman',  img: 'women/22' },
  { name: 'Tanvi Gupta',        age: 21, gender: 'Woman',  img: 'women/23' },
];

// ─── 25 Owners ────────────────────────────────────────────────────────────────
const ownerData = [
  { name: 'Deepak Mehta',         age: 24, gender: 'Man',    img: 'men/31', rent: 7500  },
  { name: 'Varun Rao',            age: 25, gender: 'Man',    img: 'men/32', rent: 8000  },
  { name: 'Akash Tiwari',         age: 23, gender: 'Man',    img: 'men/33', rent: 9000  },
  { name: 'Ishaan Verma',         age: 24, gender: 'Man',    img: 'men/34', rent: 10000 },
  { name: 'Kunal Patil',          age: 25, gender: 'Man',    img: 'men/35', rent: 6500  },
  { name: 'Mihir Joshi',          age: 23, gender: 'Man',    img: 'men/36', rent: 12000 },
  { name: 'Parth Kumar',          age: 24, gender: 'Man',    img: 'men/37', rent: 11000 },
  { name: 'Raj Nair',             age: 25, gender: 'Man',    img: 'men/38', rent: 15000 },
  { name: 'Sumit Singh',          age: 23, gender: 'Man',    img: 'men/39', rent: 9500  },
  { name: 'Tushar Mishra',        age: 24, gender: 'Man',    img: 'men/40', rent: 8500  },
  { name: 'Uday Patel',           age: 25, gender: 'Man',    img: 'men/41', rent: 7000  },
  { name: 'Vikram Gupta',         age: 23, gender: 'Man',    img: 'men/42', rent: 13000 },
  { name: 'Kavya Krishnan',       age: 24, gender: 'Woman',  img: 'women/31', rent: 8000  },
  { name: 'Ruchi Patil',          age: 25, gender: 'Woman',  img: 'women/32', rent: 9000  },
  { name: 'Ishita Iyer',          age: 23, gender: 'Woman',  img: 'women/33', rent: 7500  },
  { name: 'Aditi Desai',          age: 24, gender: 'Woman',  img: 'women/34', rent: 10000 },
  { name: 'Bhavna Joshi',         age: 25, gender: 'Woman',  img: 'women/35', rent: 8500  },
  { name: 'Chetna Rao',           age: 23, gender: 'Woman',  img: 'women/36', rent: 6000  },
  { name: 'Ekta Nair',            age: 24, gender: 'Woman',  img: 'women/37', rent: 11000 },
  { name: 'Falguni Singh',        age: 25, gender: 'Woman',  img: 'women/38', rent: 9500  },
  { name: 'Garima Mehta',         age: 23, gender: 'Woman',  img: 'women/39', rent: 7000  },
  { name: 'Harini Krishnamurthy', age: 24, gender: 'Woman',  img: 'women/40', rent: 8000  },
  { name: 'Isha Tiwari',          age: 25, gender: 'Woman',  img: 'women/41', rent: 12000 },
  { name: 'Juhi Patel',           age: 23, gender: 'Woman',  img: 'women/42', rent: 10000 },
  { name: 'Khushi Gupta',         age: 24, gender: 'Woman',  img: 'women/43', rent: 9000  },
];

const bios = [
  'Engineering student who loves clean spaces and respects quiet hours. I cook occasionally and keep the kitchen clean after every use.',
  'Final year student juggling placement prep and side projects. I keep odd hours sometimes but always respectful. Non-smoker.',
  'Fitness freak who wakes up at 6am. Looking for someone with a similar routine. I cook dal-chawal every Sunday — you are welcome.',
  'MBA student, tidy by habit, social by choice. I occasionally have friends over on weekends. Need someone chill and communicative.',
  'Night owl coder. My desk is chaotic but the rest of the space stays clean. Big fan of lo-fi music while studying.',
  'Vegetarian, non-smoker. I keep very regular hours and am usually out by 8am. Peace and quiet after 10pm is important to me.',
  'Into cricket on weekends and anime when I\'m done with assignments. Easy to live with — just don\'t touch my food in the fridge.',
  'Introvert who is social enough. I game in the evenings but use headphones always. Split expenses fairly and keep things tidy.',
  'Campus foodie and fitness enthusiast. Looking for a flatmate who is reliable with rent and doesn\'t leave dishes in the sink.',
  'Podcast listener, occasional cook, gym in the evenings. Non-drinker. I value personal space and give the same in return.',
  'Mechanical engineering student doing an internship at Tata Motors. Early bird, clean, and pay rent on time. Good vibes only.',
  'Art and music are my escape after college hours. I keep my side of the room minimalist. Looking for a calm flatmate.',
];

function makeBio() { return bios[Math.floor(Math.random() * bios.length)]; }

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trumate');
  console.log('Connected to MongoDB');

  // ── 1. Wipe all collections ──
  await Promise.all([
    User.deleteMany({}),
    Match.deleteMany({}),
    Swipe.deleteMany({}),
    Message.deleteMany({}),
    Like.deleteMany({}),
  ]);
  console.log('All collections cleared');

  const locArr = [...puneLocations].sort(() => Math.random() - 0.5);

  // ── 2. Create 25 seekers ──
  const seekers = [];
  for (let i = 0; i < seekerData.length; i++) {
    const s = seekerData[i];
    const loc = locArr[i % locArr.length];
    const email = s.name.toLowerCase().replace(/\s+/g, '.') + '@student.in';
    const user = await User.create({
      email,
      password_hash: HASH,
      name: s.name,
      age: s.age,
      gender: s.gender,
      role: 'seeker',
      major: pick(majors),
      college: pick(colleges),
      year: pick(years),
      bio: makeBio(),
      location: { city: loc.city, coordinates: loc.coords },
      images: [`https://randomuser.me/api/portraits/${s.img}.jpg`],
      interests: pickN(interestPool, 5),
      preferences: {
        smoking: Math.random() < 0.15,
        drinking: Math.random() < 0.25,
        sleep_schedule: pick(sleeps),
        cleanliness: pick(cleanlines),
        gaming: Math.random() < 0.5,
        guests: Math.random() < 0.6,
        pets: pick(petsOpts),
        diet: pick(diets),
      },
    });
    seekers.push(user);
    console.log(`  ✓ Seeker: ${s.name} (${email}) — ${loc.city}`);
  }

  // ── 3. Create 25 owners ──
  const owners = [];
  for (let i = 0; i < ownerData.length; i++) {
    const o = ownerData[i];
    const loc = locArr[(i + 5) % locArr.length];
    const email = o.name.toLowerCase().replace(/[\s.]/g, '.').replace(/[()&]/g, '') + '@student.in';
    const user = await User.create({
      email,
      password_hash: HASH,
      name: o.name,
      age: o.age,
      gender: o.gender,
      role: 'owner',
      major: pick(majors),
      college: pick(colleges),
      year: pick(years),
      rent: o.rent,
      bio: makeBio(),
      location: { city: loc.city, coordinates: loc.coords },
      images: [`https://randomuser.me/api/portraits/${o.img}.jpg`],
      interests: pickN(interestPool, 5),
      preferences: {
        smoking: Math.random() < 0.1,
        drinking: Math.random() < 0.2,
        sleep_schedule: pick(sleeps),
        cleanliness: pick(cleanlines),
        gaming: Math.random() < 0.45,
        guests: Math.random() < 0.65,
        pets: pick(petsOpts),
        diet: pick(diets),
      },
    });
    owners.push(user);
    console.log(`  ✓ Owner:  ${o.name} (${email}) — ${loc.city} — ₹${o.rent}/mo`);
  }

  // ── 4. Two dedicated test users for chat ──
  const loc0 = puneLocations[0]; // Katraj, Pune
  const loc1 = puneLocations[1]; // Kondhwa, Pune

  const testSeeker = await User.create({
    email: 'arjun.test@trumate.in',
    password_hash: HASH,
    name: 'Arjun Kapoor',
    age: 22,
    gender: 'Man',
    role: 'seeker',
    major: 'Computer Engineering',
    college: 'MIT World Peace University',
    year: 'Third Year',
    bio: 'Test account — CS student who games on weekends and cooks on Sundays. Easy to live with.',
    location: { city: loc0.city, coordinates: loc0.coords },
    images: ['https://randomuser.me/api/portraits/men/55.jpg'],
    interests: ['Coding', 'Gaming', 'Cricket', 'Movies', 'Music'],
    preferences: {
      smoking: false, drinking: false, sleep_schedule: 'night_owl',
      cleanliness: 'medium', gaming: true, guests: true, pets: 'no', diet: 'non_veg',
    },
  });

  const testOwner = await User.create({
    email: 'kavya.test@trumate.in',
    password_hash: HASH,
    name: 'Kavya Reddy',
    age: 22,
    gender: 'Woman',
    role: 'owner',
    major: 'Information Technology',
    college: 'MIT World Peace University',
    year: 'Third Year',
    rent: 9000,
    bio: 'Test account — IT student. Room in a quiet 2BHK near MITWPU. Serious about studies, fun on weekends.',
    location: { city: loc1.city, coordinates: loc1.coords },
    images: ['https://randomuser.me/api/portraits/women/55.jpg'],
    interests: ['Coding', 'Music', 'Movies', 'Fitness', 'Cooking'],
    preferences: {
      smoking: false, drinking: false, sleep_schedule: 'night_owl',
      cleanliness: 'medium', gaming: true, guests: true, pets: 'no', diet: 'non_veg',
    },
  });

  console.log('\n  ✓ Test Seeker: arjun.test@trumate.in / Test@1234');
  console.log('  ✓ Test Owner:  kavya.test@trumate.in / Test@1234');

  // ── 5. Arjun swipes right on Kavya → pending match request ──
  const u1 = testSeeker._id.toString() < testOwner._id.toString() ? testSeeker._id : testOwner._id;
  const u2 = testSeeker._id.toString() < testOwner._id.toString() ? testOwner._id : testSeeker._id;

  await Swipe.create({ swiper_id: testSeeker._id, swiped_id: testOwner._id, action: 'like' });

  await Match.create({
    user1_id: u1,
    user2_id: u2,
    requester_id: testSeeker._id,
    target_id: testOwner._id,
    status: 'pending',
    compatibility_score: 78,
  });

  console.log('\n  ✓ Match request: Arjun → Kavya (pending, score 78)');

  // ── Summary ──
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Seed complete!
  Seekers:  ${seekers.length}
  Owners:   ${owners.length}
  Test users: 2
  Total:    ${seekers.length + owners.length + 2} users
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TEST LOGIN CREDENTIALS (password: Test@1234)
  Seeker → arjun.test@trumate.in
  Owner  → kavya.test@trumate.in
  (Kavya has a pending request from Arjun in Matches → Requests)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
