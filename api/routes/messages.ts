import { Router, type Response } from 'express';
import { auth, type AuthRequest } from '../middleware/auth.js';
import Message from '../models/Message.js';
import Match from '../models/Match.js';

const router = Router();

/**
 * Get Messages for a Match
 * GET /api/messages/:matchId
 */
router.get('/:matchId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify user is part of the match
    const match = await Match.findById(matchId);
    if (!match || (match.user1_id.toString() !== currentUserId && match.user2_id.toString() !== currentUserId)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const messages = await Message.find({ match_id: matchId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Send a Message (REST version, used in tandem with Socket.io)
 * POST /api/messages/send
 */
router.post('/send', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId, content } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const match = await Match.findById(matchId);
    if (!match || (match.user1_id.toString() !== currentUserId && match.user2_id.toString() !== currentUserId)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    const message = new Message({
      match_id: matchId,
      sender_id: currentUserId,
      content,
    });
    await message.save();

    // Broadcast via Socket.io
    const io = req.app.get('io');
    io.to(matchId).emit('receive_message', message);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
