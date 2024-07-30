import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsUrl({}, { message: 'Invalid URL for photo' })
  @IsOptional()
  readonly photo?: string;

  @IsOptional()
  @IsDateString()
  readonly birthdate?: string;

  @IsString()
  @IsOptional()
  readonly horoscope?: string;

  @IsString()
  @IsOptional()
  readonly zodiac?: string;

  @IsString()
  @IsOptional()
  readonly height?: string;

  @IsString()
  @IsOptional()
  readonly weight?: string;

  @IsString()
  @IsOptional()
  readonly interest?: string;
}
