import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Match from '../models/Match.js';
import Swipe from '../models/Swipe.js';
import Message from '../models/Message.js';

const router = Router();

const puneLocations = [
  { city: 'Katraj, Pune',        coordinates: [73.8553, 18.4529] },
  { city: 'Kondhwa, Pune',       coordinates: [73.8755, 18.4707] },
  { city: 'Bibwewadi, Pune',     coordinates: [73.8490, 18.4762] },
  { city: 'Dhankawadi, Pune',    coordinates: [73.8602, 18.4613] },
  { city: 'Warje, Pune',         coordinates: [73.8120, 18.4895] },
  { city: 'Kothrud, Pune',       coordinates: [73.8125, 18.5074] },
  { city: 'Deccan, Pune',        coordinates: [73.8402, 18.5168] },
  { city: 'Shivajinagar, Pune',  coordinates: [73.8367, 18.5308] },
  { city: 'Baner, Pune',         coordinates: [73.7893, 18.5590] },
  { city: 'Hinjawadi, Pune',     coordinates: [73.7380, 18.5914] },
  { city: 'Viman Nagar, Pune',   coordinates: [73.9147, 18.5679] },
  { city: 'Kalyani Nagar, Pune', coordinates: [73.9041, 18.5469] },
  { city: 'Kharadi, Pune',       coordinates: [73.9483, 18.5528] },
  { city: 'Wakad, Pune',         coordinates: [73.7612, 18.5981] },
  { city: 'Pimpri, Pune',        coordinates: [73.8063, 18.6279] },
  { city: 'Chinchwad, Pune',     coordinates: [73.7989, 18.6441] },
  { city: 'Aundh, Pune',         coordinates: [73.8139, 18.5588] },
  { city: 'Balewadi, Pune',      coordinates: [73.7867, 18.5727] },
  { city: 'Hadapsar, Pune',      coordinates: [73.9344, 18.5021] },
  { city: 'Mundwa, Pune',        coordinates: [73.9098, 18.5301] },
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
  'Computer Engineering', 'Information Technology', 'Mechanical Engineering',
  'Electronics & Telecommunication', 'Civil Engineering', 'Data Science',
  'Artificial Intelligence & ML', 'Electrical Engineering', 'MBA (Finance)',
  'Chemical Engineering',
];

const years = ['First Year', 'Second Year', 'Third Year', 'Final Year'];
const interestPool = [
  'Cricket','Coding','Music','Gaming','Fitness','Movies','Cooking',
  'Photography','Reading','Hiking','Travel','Yoga','Anime','Football',
  'Chess','Badminton','Dancing','Art','Podcasts','Cycling',
];
const diets    = ['anything','vegetarian','non_veg','vegan'] as const;
const sleeps   = ['early_bird','night_owl'] as const;
const cleans   = ['low','medium','high'] as const;
const petsOpts = ['no','yes','love_them'] as const;

const bios = [
  'Engineering student who loves clean spaces and respects quiet hours. Cook occasionally and always clean up after.',
  'Final year student juggling placements and side projects. Odd hours sometimes but always respectful. Non-smoker.',
  'Fitness freak, up at 6am. Looking for a similar routine. Cook dal-chawal every Sunday — you are welcome.',
  'MBA student, tidy by habit, social by choice. Friends over on weekends sometimes. Need someone chill and communicative.',
  'Night owl coder. Desk is chaotic but common spaces stay clean. Big fan of lo-fi music while studying.',
  'Vegetarian, non-smoker. Regular hours, usually out by 8am. Peace and quiet after 10pm matters to me.',
  'Into cricket on weekends and anime after assignments. Easy to live with — just don\'t touch my fridge food.',
  'Introvert but social enough. Game in the evenings with headphones always on. Split expenses fairly, keep things tidy.',
  'Campus foodie and gym regular. Looking for a flatmate reliable with rent who doesn\'t leave dishes in the sink.',
  'Podcast listener, occasional cook, gym evenings. Non-drinker. Value personal space and give the same in return.',
  'Internship at Tata Motors. Early bird, clean, pay rent on time. Good vibes only.',
  'Art and music are my escape after college. Keep my space minimalist. Looking for a calm flatmate.',
];

function rnd<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndN<T>(arr: T[], n: number): T[] { return [...arr].sort(() => Math.random()-0.5).slice(0,n); }
function bio() { return bios[Math.floor(Math.random() * bios.length)]; }

const seekers = [
  { name:'Arjun Sharma',         age:21, gender:'Man',   img:'men/11'    },
  { name:'Rahul Verma',          age:22, gender:'Man',   img:'men/12'    },
  { name:'Karthik Iyer',         age:20, gender:'Man',   img:'men/13'    },
  { name:'Vivek Patil',          age:23, gender:'Man',   img:'men/14'    },
  { name:'Rohan Desai',          age:21, gender:'Man',   img:'men/15'    },
  { name:'Nikhil Joshi',         age:22, gender:'Man',   img:'men/16'    },
  { name:'Aditya Kumar',         age:20, gender:'Man',   img:'men/17'    },
  { name:'Siddharth Nair',       age:22, gender:'Man',   img:'men/18'    },
  { name:'Pranav Singh',         age:21, gender:'Man',   img:'men/19'    },
  { name:'Ankit Mishra',         age:23, gender:'Man',   img:'men/20'    },
  { name:'Harsh Patel',          age:20, gender:'Man',   img:'men/21'    },
  { name:'Yash Gupta',           age:22, gender:'Man',   img:'men/22'    },
  { name:'Priya Sharma',         age:21, gender:'Woman', img:'women/11'  },
  { name:'Sneha Patil',          age:22, gender:'Woman', img:'women/12'  },
  { name:'Ananya Iyer',          age:20, gender:'Woman', img:'women/13'  },
  { name:'Pooja Desai',          age:23, gender:'Woman', img:'women/14'  },
  { name:'Nisha Joshi',          age:21, gender:'Woman', img:'women/15'  },
  { name:'Kavita Rao',           age:22, gender:'Woman', img:'women/16'  },
  { name:'Riya Nair',            age:20, gender:'Woman', img:'women/17'  },
  { name:'Sakshi Singh',         age:22, gender:'Woman', img:'women/18'  },
  { name:'Divya Mehta',          age:21, gender:'Woman', img:'women/19'  },
  { name:'Shreya Rao',           age:23, gender:'Woman', img:'women/20'  },
  { name:'Neha Tiwari',          age:20, gender:'Woman', img:'women/21'  },
  { name:'Meghna Patel',         age:22, gender:'Woman', img:'women/22'  },
  { name:'Tanvi Gupta',          age:21, gender:'Woman', img:'women/23'  },
];

const owners = [
  { name:'Deepak Mehta',          age:24, gender:'Man',   img:'men/31',   rent:7500  },
  { name:'Varun Rao',             age:25, gender:'Man',   img:'men/32',   rent:8000  },
  { name:'Akash Tiwari',          age:23, gender:'Man',   img:'men/33',   rent:9000  },
  { name:'Ishaan Verma',          age:24, gender:'Man',   img:'men/34',   rent:10000 },
  { name:'Kunal Patil',           age:25, gender:'Man',   img:'men/35',   rent:6500  },
  { name:'Mihir Joshi',           age:23, gender:'Man',   img:'men/36',   rent:12000 },
  { name:'Parth Kumar',           age:24, gender:'Man',   img:'men/37',   rent:11000 },
  { name:'Raj Nair',              age:25, gender:'Man',   img:'men/38',   rent:15000 },
  { name:'Sumit Singh',           age:23, gender:'Man',   img:'men/39',   rent:9500  },
  { name:'Tushar Mishra',         age:24, gender:'Man',   img:'men/40',   rent:8500  },
  { name:'Uday Patel',            age:25, gender:'Man',   img:'men/41',   rent:7000  },
  { name:'Vikram Gupta',          age:23, gender:'Man',   img:'men/42',   rent:13000 },
  { name:'Kavya Krishnan',        age:24, gender:'Woman', img:'women/31', rent:8000  },
  { name:'Ruchi Patil',           age:25, gender:'Woman', img:'women/32', rent:9000  },
  { name:'Ishita Iyer',           age:23, gender:'Woman', img:'women/33', rent:7500  },
  { name:'Aditi Desai',           age:24, gender:'Woman', img:'women/34', rent:10000 },
  { name:'Bhavna Joshi',          age:25, gender:'Woman', img:'women/35', rent:8500  },
  { name:'Chetna Rao',            age:23, gender:'Woman', img:'women/36', rent:6000  },
  { name:'Ekta Nair',             age:24, gender:'Woman', img:'women/37', rent:11000 },
  { name:'Falguni Singh',         age:25, gender:'Woman', img:'women/38', rent:9500  },
  { name:'Garima Mehta',          age:23, gender:'Woman', img:'women/39', rent:7000  },
  { name:'Harini Krishnamurthy',  age:24, gender:'Woman', img:'women/40', rent:8000  },
  { name:'Isha Tiwari',           age:25, gender:'Woman', img:'women/41', rent:12000 },
  { name:'Juhi Patel',            age:23, gender:'Woman', img:'women/42', rent:10000 },
  { name:'Khushi Gupta',          age:24, gender:'Woman', img:'women/43', rent:9000  },
];

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // ── Wipe ──
    await Promise.all([
      User.deleteMany({}),
      Match.deleteMany({}),
      Swipe.deleteMany({}),
      Message.deleteMany({}),
    ]);

    const HASH = await bcrypt.hash('Test@1234', 10);
    const locs = [...puneLocations].sort(() => Math.random() - 0.5);
    const created: string[] = [];

    // ── Seekers ──
    for (let i = 0; i < seekers.length; i++) {
      const s = seekers[i];
      const loc = locs[i % locs.length];
      const email = s.name.toLowerCase().replace(/\s+/g, '.') + '@student.in';
      await User.create({
        email, password_hash: HASH, name: s.name, age: s.age,
        gender: s.gender, role: 'seeker',
        major: rnd(majors), college: rnd(colleges), year: rnd(years),
        bio: bio(),
        location: { city: loc.city, coordinates: loc.coordinates },
        images: [`https://randomuser.me/api/portraits/${s.img}.jpg`],
        interests: rndN(interestPool, 5),
        preferences: {
          smoking: Math.random()<0.15, drinking: Math.random()<0.25,
          sleep_schedule: rnd(sleeps), cleanliness: rnd(cleans),
          gaming: Math.random()<0.5, guests: Math.random()<0.6,
          pets: rnd(petsOpts), diet: rnd(diets),
        },
      });
      created.push(`Seeker: ${s.name} (${email}) — ${loc.city}`);
    }

    // ── Owners ──
    for (let i = 0; i < owners.length; i++) {
      const o = owners[i];
      const loc = locs[(i + 8) % locs.length];
      const email = o.name.toLowerCase().replace(/\s+/g, '.') + '@student.in';
      await User.create({
        email, password_hash: HASH, name: o.name, age: o.age,
        gender: o.gender, role: 'owner',
        major: rnd(majors), college: rnd(colleges), year: rnd(years),
        rent: o.rent, bio: bio(),
        location: { city: loc.city, coordinates: loc.coordinates },
        images: [`https://randomuser.me/api/portraits/${o.img}.jpg`],
        interests: rndN(interestPool, 5),
        preferences: {
          smoking: Math.random()<0.1, drinking: Math.random()<0.2,
          sleep_schedule: rnd(sleeps), cleanliness: rnd(cleans),
          gaming: Math.random()<0.45, guests: Math.random()<0.65,
          pets: rnd(petsOpts), diet: rnd(diets),
        },
      });
      created.push(`Owner: ${o.name} (${email}) — ${loc.city} — ₹${o.rent}/mo`);
    }

    // ── Two test users for chat ──
    const testSeeker = await User.create({
      email: 'arjun.test@trumate.in', password_hash: HASH,
      name: 'Arjun Kapoor', age: 22, gender: 'Man', role: 'seeker',
      major: 'Computer Engineering', college: 'MIT World Peace University',
      year: 'Third Year',
      bio: 'CS student who games on weekends and cooks on Sundays. Easy to live with, respectful of shared spaces.',
      location: { city: 'Katraj, Pune', coordinates: [73.8553, 18.4529] },
      images: ['https://randomuser.me/api/portraits/men/55.jpg'],
      interests: ['Coding','Gaming','Cricket','Movies','Music'],
      preferences: { smoking:false, drinking:false, sleep_schedule:'night_owl',
        cleanliness:'medium', gaming:true, guests:true, pets:'no', diet:'non_veg' },
    });

    const testOwner = await User.create({
      email: 'kavya.test@trumate.in', password_hash: HASH,
      name: 'Kavya Reddy', age: 22, gender: 'Woman', role: 'owner',
      major: 'Information Technology', college: 'MIT World Peace University',
      year: 'Third Year', rent: 9000,
      bio: 'IT student with a room in a quiet 2BHK near MITWPU. Serious about studies, fun on weekends.',
      location: { city: 'Kondhwa, Pune', coordinates: [73.8755, 18.4707] },
      images: ['https://randomuser.me/api/portraits/women/55.jpg'],
      interests: ['Coding','Music','Movies','Fitness','Cooking'],
      preferences: { smoking:false, drinking:false, sleep_schedule:'night_owl',
        cleanliness:'medium', gaming:true, guests:true, pets:'no', diet:'non_veg' },
    });

    // ── Pending match: Arjun → Kavya ──
    const u1 = testSeeker._id.toString() < testOwner._id.toString() ? testSeeker._id : testOwner._id;
    const u2 = testSeeker._id.toString() < testOwner._id.toString() ? testOwner._id : testSeeker._id;
    await Swipe.create({ swiper_id: testSeeker._id, swiped_id: testOwner._id, action: 'like' });
    await Match.create({
      user1_id: u1, user2_id: u2,
      requester_id: testSeeker._id, target_id: testOwner._id,
      status: 'pending', compatibility_score: 78,
    });

    res.json({
      success: true,
      summary: {
        seekers: seekers.length,
        owners: owners.length,
        testUsers: 2,
        total: seekers.length + owners.length + 2,
        pendingMatch: 'Arjun Kapoor → Kavya Reddy',
      },
      testCredentials: {
        password: 'Test@1234',
        seeker: 'arjun.test@trumate.in',
        owner:  'kavya.test@trumate.in',
      },
      allEmails: created,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
