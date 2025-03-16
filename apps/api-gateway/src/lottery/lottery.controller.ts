import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Lottery')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Get('draws')
  @ApiOperation({ summary: 'Get all lottery draws' })
  @ApiResponse({ status: 200, description: 'Returns all lottery draws.' })
  getAllDraws() {
    return this.lotteryService.getAllDraws();
  }

  @Get('draws/:id')
  @ApiOperation({ summary: 'Get a specific lottery draw' })
  @ApiResponse({ status: 200, description: 'Returns the specified lottery draw.' })
  @ApiResponse({ status: 404, description: 'Lottery draw not found.' })
  getDrawById(@Param('id') id: string) {
    return this.lotteryService.getDrawById(id);
  }

  @Post('tickets')
  @ApiOperation({ summary: 'Purchase a lottery ticket' })
  @ApiResponse({ status: 201, description: 'Ticket purchased successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request parameters.' })
  purchaseTicket(@Body() requestBody: any) {
    return this.lotteryService.purchaseTicket(requestBody);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket information' })
  @ApiResponse({ status: 200, description: 'Returns the ticket information.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  getTicketById(@Param('id') id: string) {
    return this.lotteryService.getTicketById(id);
  }
}