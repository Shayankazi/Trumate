import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  user1_id: mongoose.Types.ObjectId; // One of the users
  user2_id: mongoose.Types.ObjectId; // The other user
  requester_id: mongoose.Types.ObjectId; // User who initiated the request
  target_id: mongoose.Types.ObjectId; // User who needs to accept/reject
  status: 'pending' | 'accepted' | 'rejected';
  compatibility_score: number;
  matched_at: Date;
  is_active: boolean;
}

const MatchSchema: Schema = new Schema({
  user1_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requester_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  compatibility_score: { type: Number, min: 0, max: 100, required: true },
  matched_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
});

MatchSchema.index({ user1_id: 1, user2_id: 1 }, { unique: true });
MatchSchema.index({ target_id: 1, status: 1 });

export default mongoose.model<IMatch>('Match', MatchSchema);
