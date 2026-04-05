import mongoose, { Schema, Document } from 'mongoose';

export interface ISwipe extends Document {
  swiper_id: mongoose.Types.ObjectId;
  swiped_id: mongoose.Types.ObjectId;
  action: 'like' | 'pass';
  created_at: Date;
}

const SwipeSchema: Schema = new Schema({
  swiper_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  swiped_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['like', 'pass'], required: true },
  created_at: { type: Date, default: Date.now },
});

SwipeSchema.index({ swiper_id: 1, swiped_id: 1 }, { unique: true });

export default mongoose.model<ISwipe>('Swipe', SwipeSchema);
