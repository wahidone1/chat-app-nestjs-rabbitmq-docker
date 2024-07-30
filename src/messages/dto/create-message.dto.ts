import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
