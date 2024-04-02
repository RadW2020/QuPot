import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsOptional } from "class-validator";

export class RequestPasswordChangeDto {
  @ApiProperty({
    description: "Email del usuario",
    example: "usuario@ejemplo.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "URL de redirección para cambiar la contraseña",
    example: "http://localhost:3000/reset-password",
    required: false,
  })
  @IsString()
  @IsOptional()
  resetUrl?: string;
}
