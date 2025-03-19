import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "John Doe",
    description: "User full name",
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: "user@example.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
