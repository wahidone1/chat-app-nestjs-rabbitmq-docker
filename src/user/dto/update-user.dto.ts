import {
  IsString,
  IsOptional,
  IsUrl,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsUrl({}, { message: 'Invalid URL for photo' })
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsDateString({}, { message: 'Invalid date format' })
  @IsOptional()
  birthdate?: string;

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
