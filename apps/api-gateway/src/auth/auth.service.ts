import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
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
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;
  private readonly apiGatewayUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.authServiceUrl = this.configService.get<string>("AUTH_SERVICE_URL");
    this.apiGatewayUrl =
      this.configService.get<string>("API_GATEWAY_URL") ||
      "http://localhost:8000";
  }

  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<LoginResponse>(
          `${this.authServiceUrl}/api/v1/auth/login`,
          credentials
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        "Authentication service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async register(userData: RegisterDto): Promise<RegisterResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<RegisterResponse>(
          `${this.authServiceUrl}/api/v1/auth/register`,
          userData
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new HttpException(
          error.response.data.message,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        "Registration service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async connectWallet(walletData: WalletDto): Promise<WalletResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<WalletResponse>(
          `${this.authServiceUrl}/api/v1/auth/connect-wallet`,
          walletData
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new HttpException(
          error.response.data.message,
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        "Wallet connection service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshToken(
    refreshTokenData: RefreshTokenDto
  ): Promise<RefreshTokenResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<RefreshTokenResponse>(
          `${this.authServiceUrl}/api/v1/auth/refresh`,
          refreshTokenData
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new HttpException(
          "Invalid or expired refresh token",
          HttpStatus.UNAUTHORIZED
        );
      }
      throw new HttpException(
        "Token refresh service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async requestPasswordChange(
    requestData: RequestPasswordChangeDto
  ): Promise<RequestPasswordChangeResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<RequestPasswordChangeResponse>(
          `${this.authServiceUrl}/api/v1/auth/request-password-change`,
          {
            ...requestData,
            resetUrl: `${this.apiGatewayUrl}/password-reset/page?token=`,
          }
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        "Password change request service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmPasswordChange(
    confirmData: ConfirmPasswordChangeDto
  ): Promise<ConfirmPasswordChangeResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<ConfirmPasswordChangeResponse>(
          `${this.authServiceUrl}/api/v1/auth/confirm-password-change`,
          confirmData
        )
      );
      return data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new HttpException(
          "Invalid or expired token",
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        "Password change confirmation service error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWallet(userId: string): Promise<WalletResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<WalletResponse>(
        `${this.authServiceUrl}/auth/wallet/${userId}`
      )
    );
    return data;
  }
}
