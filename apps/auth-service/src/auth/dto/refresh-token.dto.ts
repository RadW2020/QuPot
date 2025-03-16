import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ description: "The refresh token" })
  @IsString()
  refresh_token: string;
}
