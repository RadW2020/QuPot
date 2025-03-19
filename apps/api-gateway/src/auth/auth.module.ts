import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordResetController } from "./password-reset.controller";

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController, PasswordResetController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
