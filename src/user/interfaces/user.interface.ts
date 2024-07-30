import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  password: string;
  name?: string;
  email?: string;
  photo?: string;
  birthdate?: Date;
  height?: number;
  weight?: number;
  horoscope?: string;
  zodiac?: string;
  interest?: string;
}
