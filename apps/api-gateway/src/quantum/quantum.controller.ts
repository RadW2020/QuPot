import { Controller, Post, Body, Get } from '@nestjs/common';
import { QuantumService } from './quantum.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Quantum')
@Controller('quantum')
export class QuantumController {
  constructor(private readonly quantumService: QuantumService) {}

  @Post('random')
  @ApiOperation({ summary: 'Generate quantum random numbers' })
  @ApiResponse({ status: 201, description: 'Random numbers generated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  generateRandomNumbers(@Body() requestBody: any) {
    return this.quantumService.generateRandomNumbers(requestBody);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get quantum service status' })
  @ApiResponse({ status: 200, description: 'Returns the status of the quantum service.' })
  getStatus() {
    return this.quantumService.getStatus();
  }
}