import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid registration data.' })
  register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Post('connect-wallet')
  @ApiOperation({ summary: 'Connect blockchain wallet' })
  @ApiResponse({ status: 200, description: 'Wallet connected successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid wallet data.' })
  connectWallet(@Body() walletData: any) {
    return this.authService.connectWallet(walletData);
  }
}