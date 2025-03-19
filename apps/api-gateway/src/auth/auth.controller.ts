import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { WalletDto } from "./dto/wallet.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RequestPasswordChangeDto } from "./dto/request-password-change.dto";
import { ConfirmPasswordChangeDto } from "./dto/confirm-password-change.dto";
import {
  LoginResponse,
  RegisterResponse,
  WalletResponse,
  RefreshTokenResponse,
  RequestPasswordChangeResponse,
  ConfirmPasswordChangeResponse,
} from "./interfaces/auth.interface";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login successful.",
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials.",
  })
  async login(@Body() credentials: LoginDto): Promise<LoginResponse> {
    return this.authService.login(credentials);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "User registered successfully.",
    type: RegisterResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid registration data.",
  })
  async register(@Body() userData: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(userData);
  }

  @Post("connect-wallet")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Connect blockchain wallet" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Wallet connected successfully.",
    type: WalletResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid wallet data.",
  })
  async connectWallet(@Body() walletData: WalletDto): Promise<WalletResponse> {
    return this.authService.connectWallet(walletData);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token refreshed successfully.",
    type: RefreshTokenResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid or expired refresh token.",
  })
  async refreshToken(
    @Body() refreshTokenData: RefreshTokenDto
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshTokenData);
  }

  @Post("request-password-change")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password change" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password change email sent successfully.",
    type: RequestPasswordChangeResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User not found.",
  })
  async requestPasswordChange(
    @Body() requestData: RequestPasswordChangeDto
  ): Promise<RequestPasswordChangeResponse> {
    return this.authService.requestPasswordChange(requestData);
  }

  @Post("confirm-password-change")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Confirm password change" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password changed successfully.",
    type: ConfirmPasswordChangeResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid or expired token.",
  })
  async confirmPasswordChange(
    @Body() confirmData: ConfirmPasswordChangeDto
  ): Promise<ConfirmPasswordChangeResponse> {
    return this.authService.confirmPasswordChange(confirmData);
  }
}
