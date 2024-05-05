import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('contracts')
  @ApiOperation({ summary: 'Get deployed contract information' })
  @ApiResponse({ status: 200, description: 'Returns contract information.' })
  getContractInfo() {
    return this.blockchainService.getContractInfo();
  }

  @Get('transactions/:txHash')
  @ApiOperation({ summary: 'Get transaction details' })
  @ApiResponse({ status: 200, description: 'Returns transaction details.' })
  @ApiResponse({ status: 404, description: 'Transaction not found.' })
  getTransaction(@Param('txHash') txHash: string) {
    return this.blockchainService.getTransaction(txHash);
  }

  @Post('verify-draw')
  @ApiOperation({ summary: 'Verify lottery draw on blockchain' })
  @ApiResponse({ status: 200, description: 'Draw verification result.' })
  verifyDraw(@Body() drawData: any) {
    return this.blockchainService.verifyDraw(drawData);
  }
}