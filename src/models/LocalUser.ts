
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ILocalUser extends Document {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const LocalUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'basic'], default: 'basic' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
LocalUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
LocalUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const LocalUser = mongoose.model<ILocalUser>('LocalUser', LocalUserSchema);
