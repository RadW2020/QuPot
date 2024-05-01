import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Put,
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
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import {
  LoginResponse,
  RegisterResponse,
  WalletResponse,
  RefreshTokenResponse,
  RequestPasswordChangeResponse,
  ConfirmPasswordChangeResponse,
} from "./dto/responses";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Login exitoso",
    type: LoginResponse,
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Usuario registrado exitosamente",
    type: RegisterResponse,
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("wallet/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener wallet del usuario" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Wallet obtenida exitosamente",
    type: WalletResponse,
  })
  async getWallet(@Param("userId") userId: string) {
    return this.authService.getWallet(userId);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refrescar token de acceso" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Token refrescado exitosamente",
    type: RefreshTokenResponse,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post("password/request-change")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Solicitar cambio de contraseña" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Solicitud de cambio de contraseña enviada",
    type: RequestPasswordChangeResponse,
  })
  async requestPasswordChange(
    @Body() requestPasswordChangeDto: RequestPasswordChangeDto
  ) {
    return this.authService.requestPasswordChange(requestPasswordChangeDto);
  }

  @Put("password/confirm-change")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Confirmar cambio de contraseña" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Contraseña cambiada exitosamente",
    type: ConfirmPasswordChangeResponse,
  })
  async confirmPasswordChange(
    @Body() confirmPasswordChangeDto: ConfirmPasswordChangeDto
  ) {
    return this.authService.confirmPasswordChange(confirmPasswordChangeDto);
  }
}
