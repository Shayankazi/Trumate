import { Router, type Response } from 'express';
import { auth, type AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import Swipe from '../models/Swipe.js';

const router = Router();

/**
 * Get Current User Profile
 * GET /api/users/me
 */
router.get('/me', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Update User Profile
 * PUT /api/users/profile
 */
router.put('/profile', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, age, gender, role, major, college, year, interests, location, bio, preferences, images, rent } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = name || user.name;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.major = major || user.major;
    user.college = college || user.college;
    user.year = year || user.year;
    user.interests = interests || user.interests;
    user.location = location || user.location;
    user.bio = bio || user.bio;
    user.preferences = preferences || user.preferences;
    user.images = images || user.images;
    if (user.role === 'owner') {
      user.rent = rent;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get Discovery Users
 * GET /api/users/discover
 */
router.get('/discover', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUser = await User.findById(req.user?.id);
    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get users that current user has already swiped on
    const swipedUserIds = await Swipe.find({ swiper_id: currentUser._id }).distinct('swiped_id');

    // Find users of opposite role that haven't been swiped on AND are in the same city
    const oppositeRole = currentUser.role === 'owner' ? 'seeker' : 'owner';
    
    // Extract city (last part after comma if present, e.g., "Kothrud, Pune" -> "pune")
    const cityParts = currentUser.location.city.split(',');
    const currentCity = (cityParts.length > 1 ? cityParts[cityParts.length - 1] : cityParts[0]).trim().toLowerCase();

    const users = await User.find({
      _id: { $nin: [...swipedUserIds, currentUser._id] },
      role: oppositeRole,
      'location.city': { $regex: new RegExp(currentCity, 'i') } // Strict city matching
    }).limit(40);

    // Area groups for proximity matching
    const areaGroups: Record<string, string[]> = {
      // Pune Groups
      'pune_central': ['shivajinagar', 'fc road', 'ganeshkhind', 'deccan', 'sb road', 'model colony'],
      'pune_west': ['kothrud', 'karve nagar', 'erandwane', 'warje', 'bavdhan'],
      'pune_east': ['viman nagar', 'kalyani nagar', 'kharadi', 'yerwada', 'wadgaon sheri'],
      'pune_north': ['pimpri', 'chinchwad', 'nigdi', 'akurdi', 'dighi', 'bhosari'],
      'pune_south': ['dhankawadi', 'bibwewadi', 'katraj', 'vadgaon budruk', 'dhayari'],
      'pune_tech': ['hinjawadi', 'baner', 'pashan', 'balewadi', 'wakad'],
      'pune_camp': ['camp', 'mg road', 'koregaon park', 'bund garden'],
      // Mumbai Groups
      'mumbai_south': ['colaba', 'fort', 'marine drive', 'south bombay', 'cuffe parade'],
      'mumbai_west_suburbs': ['bandra', 'khar', 'santacruz', 'vile parle', 'andheri'],
      'mumbai_posh_west': ['juhu', 'versova', 'lokhandwala'],
      'mumbai_north_west': ['borivali', 'kandivali', 'malad', 'goregaon'],
      'mumbai_central': ['dadar', 'matunga', 'sion', 'mahim', 'worli', 'lower parel'],
      'mumbai_east': ['powai', 'ghatkopar', 'mulund', 'kurla', 'chembur']
    };

    const getAreaGroup = (cityStr: string) => {
      const area = cityStr.toLowerCase();
      for (const [groupName, areas] of Object.entries(areaGroups)) {
        if (areas.some(a => area.includes(a))) return groupName;
      }
      return null;
    };

    // Calculate compatibility score for each user
    const usersWithScores = users.map(user => {
      let score = 0;

      // 1. Location matching (CRITICAL: 60 points)
      // Extract specific area if available (e.g., "Kothrud, Pune" -> "kothrud")
      const user1Location = currentUser.location.city.toLowerCase();
      const user2Location = user.location.city.toLowerCase();
      
      const area1 = user1Location.split(',')[0].trim();
      const area2 = user2Location.split(',')[0].trim();
      
      const group1 = getAreaGroup(user1Location);
      const group2 = getAreaGroup(user2Location);

      if (area1 === area2) {
        score += 60; // Exact same area/college
      } else if (group1 && group2 && group1 === group2) {
        score += 45; // Same area group (walking distance/close)
      } else {
        // Different area group but same city
        score += 15; 
      }

      // 2. Preference matching (up to 25 points)
      const prefs1 = currentUser.preferences;
      const prefs2 = user.preferences;
      
      let matchCount = 0;
      const totalPrefs = 8;
      
      if (prefs1.smoking === prefs2.smoking) matchCount++;
      if (prefs1.drinking === prefs2.drinking) matchCount++;
      if (prefs1.sleep_schedule === prefs2.sleep_schedule) matchCount++;
      if (prefs1.cleanliness === prefs2.cleanliness) matchCount++;
      if (prefs1.gaming === prefs2.gaming) matchCount++;
      if (prefs1.guests === prefs2.guests) matchCount++;
      if (prefs1.pets === prefs2.pets) matchCount++;
      if (prefs1.diet === prefs2.diet) matchCount++;

      score += (matchCount / totalPrefs) * 25;

      // 3. Interest matching (up to 15 points)
      if (currentUser.interests && user.interests) {
        const commonInterests = currentUser.interests.filter(i => user.interests.includes(i));
        if (commonInterests.length > 0) {
          score += Math.min(commonInterests.length * 3, 15);
        }
      }

      const finalScore = Math.max(0, Math.min(Math.round(score), 100));
      
      return {
        ...user.toObject(),
        compatibilityScore: finalScore,
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore); // Sort by highest match first

    res.json(usersWithScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
