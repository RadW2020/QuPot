import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuantumModule } from './quantum/quantum.module';
import { LotteryModule } from './lottery/lottery.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    QuantumModule,
    LotteryModule, 
    BlockchainModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}