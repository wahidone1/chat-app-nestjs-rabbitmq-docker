import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String },
  name: { type: String },
  email: { type: String, unique: true },
  birthdate: { type: Date },
  height: { type: Number },
  weight: { type: Number },
  horoscope: { type: String },
  zodiac: { type: String },
  interest: { type: String },
});
