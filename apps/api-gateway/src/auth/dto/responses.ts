import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class RegisterResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: string;
}

export class WalletResponse {
  @ApiProperty()
  address: string;

  @ApiProperty()
  balance: string;
}

export class RefreshTokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expiresIn: number;
}

export class RequestPasswordChangeResponse {
  @ApiProperty()
  message: string;
}

export class ConfirmPasswordChangeResponse {
  @ApiProperty()
  message: string;
}
