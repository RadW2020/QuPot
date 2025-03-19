import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RequestPasswordChangeDto } from "./dto/request-password-change.dto";
import { ConfirmPasswordChangeDto } from "./dto/confirm-password-change.dto";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: "1h" }),
      this.jwtService.signAsync(payload, { expiresIn: "7d" }),
    ]);

    // Save refresh token in database
    user.refreshToken = refresh_token;
    await this.userRepository.save(user);

    return {
      access_token,
      refresh_token,
    };
  }

  async register(
    createUserDto: CreateUserDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(
    loginDto: LoginDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken
      );

      // Find user and check if refresh token matches
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Generate new tokens
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      // Remove refresh token
      user.refreshToken = null;
      await this.userRepository.save(user);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async requestPasswordChange(requestData: RequestPasswordChangeDto) {
    const user = await this.userRepository.findOne({
      where: { email: requestData.email },
    });

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    // Guardar token en la base de datos
    user.passwordResetToken = token;
    user.passwordResetExpires = expiresAt;
    await this.userRepository.save(user);

    // TODO: Enviar email con el token
    // Por ahora solo retornamos un mensaje
    return {
      message:
        "Se ha enviado un email con las instrucciones para cambiar la contraseña",
      emailSent: true,
    };
  }

  async confirmPasswordChange(confirmData: ConfirmPasswordChangeDto) {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: confirmData.token,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException("Token inválido o expirado");
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(confirmData.newPassword, 10);

    // Actualizar contraseña y limpiar token
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    return {
      message: "Contraseña actualizada correctamente",
      success: true,
    };
  }
}
