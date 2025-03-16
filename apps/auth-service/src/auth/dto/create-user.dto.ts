import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "The email of the user",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "John" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "The password of the user",
    example: "StrongP@ssw0rd",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "The username of the user",
    example: "johndoe",
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({ example: { preferences: { theme: "dark" } } })
  @IsOptional()
  metadata?: Record<string, any>;
}
