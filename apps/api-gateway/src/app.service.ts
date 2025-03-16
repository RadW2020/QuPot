import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to the QuPot Quantum Lottery Platform API',
      version: '1.0.0',
    };
  }

  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        quantum: 'up',
        lottery: 'up',
        blockchain: 'up',
        auth: 'up',
      },
    };
  }
}