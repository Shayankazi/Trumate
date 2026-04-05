import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  from_user: mongoose.Types.ObjectId;
  to_user: mongoose.Types.ObjectId;
  type: 'like' | 'pass';
  created_at: Date;
}

const LikeSchema: Schema = new Schema({
  from_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'pass'], required: true },
  created_at: { type: Date, default: Date.now },
});

LikeSchema.index({ from_user: 1, to_user: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
