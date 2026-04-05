import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  match_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  is_read: boolean;
}

const MessageSchema: Schema = new Schema({
  match_id: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  timestamp: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false },
});

MessageSchema.index({ match_id: 1, timestamp: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
