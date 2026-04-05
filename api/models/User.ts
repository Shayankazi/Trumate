import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  age: number;
  gender?: string;
  role: 'owner' | 'seeker';
  major?: string;
  college?: string;
  year?: string;
  interests: string[];
  location: {
    city: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  rent?: number;
  bio?: string;
  images: string[];
  preferences: {
    smoking: boolean;
    drinking: boolean;
    sleep_schedule: 'early_bird' | 'night_owl';
    cleanliness: 'low' | 'medium' | 'high';
    gaming: boolean;
    guests: boolean;
    pets: 'yes' | 'no' | 'love_them';
    diet: 'vegan' | 'vegetarian' | 'non_veg' | 'anything';
  };
  is_online: boolean;
  last_active: Date;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 99 },
  gender: { type: String },
  role: { type: String, enum: ['owner', 'seeker'], required: true },
  major: { type: String },
  college: { type: String },
  year: { type: String },
  interests: [{ type: String }],
  location: {
    city: { type: String, required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  rent: { type: Number, min: 0 },
  bio: { type: String, maxlength: 500 },
  images: [{ type: String }],
  preferences: {
    smoking: { type: Boolean, default: false },
    drinking: { type: Boolean, default: false },
    sleep_schedule: { type: String, enum: ['early_bird', 'night_owl'], default: 'early_bird' },
    cleanliness: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    gaming: { type: Boolean, default: false },
    guests: { type: Boolean, default: true },
    pets: { type: String, enum: ['yes', 'no', 'love_them'], default: 'no' },
    diet: { type: String, enum: ['vegan', 'vegetarian', 'non_veg', 'anything'], default: 'anything' },
  },
  is_online: { type: Boolean, default: false },
  last_active: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
});

UserSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IUser>('User', UserSchema);
