import { Router, type Response } from 'express';
import { auth, type AuthRequest } from '../middleware/auth.js';
import User from '../models/User.js';
import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';

const router = Router();

/**
 * Swipe Action (Like or Pass)
 * POST /api/matches/swipe
 */
router.post('/swipe', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Save swipe
    const swipe = new Swipe({
      swiper_id: currentUserId,
      swiped_id: targetUserId,
      action,
    });
    await swipe.save();

    if (action === 'like') {
      // Check if a match already exists (any status)
      const user1 = currentUserId < targetUserId ? currentUserId : targetUserId;
      const user2 = currentUserId < targetUserId ? targetUserId : currentUserId;

      const existingMatch = await Match.findOne({
        user1_id: user1,
        user2_id: user2,
      });

      if (existingMatch) {
        // If the other user already liked, this could be an acceptance
        // But in the new flow, we just mark it as a "Request Sent"
        // and wait for the target to accept.
        res.json({ message: 'Request already exists' });
        return;
      }

      // Create a pending match (request)
      const match = new Match({
        user1_id: user1,
        user2_id: user2,
        requester_id: currentUserId,
        target_id: targetUserId,
        status: 'pending',
        compatibility_score: 85, // Mock score for now
      });
      await match.save();

      res.json({
        isRequestSent: true,
        matchId: match._id,
      });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get Pending Requests for Current User
 * GET /api/matches/requests
 */
/**
 * Get Outgoing Requests Sent by Current User
 * GET /api/matches/sent
 */
router.get('/sent', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const sentRequests = await Match.find({
      requester_id: currentUserId,
      status: 'pending',
    }).populate('target_id', 'name age images role bio major college year location');

    res.json(sentRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/requests', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const requests = await Match.find({
      target_id: currentUserId,
      status: 'pending',
    }).populate('requester_id', 'name age images role bio major college year');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Accept Match Request
 * POST /api/matches/:matchId/accept
 */
router.post('/:matchId/accept', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { matchId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      target_id: currentUserId,
      status: 'pending',
    });

    if (!match) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    match.status = 'accepted';
    match.matched_at = new Date();
    await match.save();

    res.json({ success: true, match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Reject Match Request
 * POST /api/matches/:matchId/reject
 */
router.post('/:matchId/reject', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const { matchId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      target_id: currentUserId,
      status: 'pending',
    });

    if (!match) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    match.status = 'rejected';
    await match.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Restack (Clear "pass" swipes to see users again)
 * POST /api/matches/restack
 */
router.post('/restack', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Delete all "pass" swipes made by this user
    await Swipe.deleteMany({
      swiper_id: currentUserId,
      action: 'pass'
    });

    res.json({ success: true, message: 'Swipes cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Get All Accepted Matches
 * GET /api/matches
 */
router.get('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const matches = await Match.find({
      $or: [{ user1_id: currentUserId }, { user2_id: currentUserId }],
      status: 'accepted',
    }).populate('user1_id user2_id', 'name age images role bio major college year');

    // Filter out current user and format match object
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1_id._id.toString() === currentUserId ? match.user2_id : match.user1_id;
      return {
        _id: match._id,
        user: otherUser,
        compatibility_score: match.compatibility_score,
        matched_at: match.matched_at,
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
