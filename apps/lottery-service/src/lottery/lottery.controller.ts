import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { LotteryService } from "./lottery.service";
import { CreateDrawDto } from "./dto/create-draw.dto";
import { UpdateDrawDto } from "./dto/update-draw.dto";
import { Draw, DrawResult } from "./interfaces/draw.interface";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("lottery")
@Controller("lottery")
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  @ApiOperation({ summary: "Create a new draw" })
  @ApiResponse({
    status: 201,
    description: "The draw has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Invalid data." })
  create(@Body() createDrawDto: CreateDrawDto): Promise<Draw> {
    return this.lotteryService.create(createDrawDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all draws" })
  @ApiResponse({
    status: 200,
    description: "List of draws retrieved successfully.",
  })
  findAll(): Promise<Draw[]> {
    return this.lotteryService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a draw by ID" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw found." })
  @ApiResponse({ status: 404, description: "Draw not found." })
  findOne(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a draw" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw updated successfully." })
  @ApiResponse({ status: 404, description: "Draw not found." })
  update(
    @Param("id") id: string,
    @Body() updateDrawDto: UpdateDrawDto
  ): Promise<Draw> {
    return this.lotteryService.update(id, updateDrawDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a draw" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw deleted successfully." })
  @ApiResponse({ status: 404, description: "Draw not found." })
  remove(@Param("id") id: string): Promise<void> {
    return this.lotteryService.remove(id);
  }

  @Post(":id/start")
  @ApiOperation({ summary: "Start a draw" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw started successfully." })
  @ApiResponse({
    status: 400,
    description: "The draw is not in PENDING status.",
  })
  @ApiResponse({ status: 404, description: "Draw not found." })
  startDraw(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.startDraw(id);
  }

  @Post(":id/complete")
  @ApiOperation({ summary: "Complete a draw with winning numbers" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw completed successfully." })
  @ApiResponse({
    status: 400,
    description: "The draw is not in IN_PROGRESS status.",
  })
  @ApiResponse({ status: 404, description: "Draw not found." })
  completeDraw(
    @Param("id") id: string,
    @Body("winningNumbers") winningNumbers: number[]
  ): Promise<DrawResult> {
    return this.lotteryService.completeDraw(id, winningNumbers);
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel a draw" })
  @ApiParam({ name: "id", description: "Draw ID" })
  @ApiResponse({ status: 200, description: "Draw cancelled successfully." })
  @ApiResponse({
    status: 400,
    description: "Cannot cancel a completed draw.",
  })
  @ApiResponse({ status: 404, description: "Draw not found." })
  cancelDraw(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.cancelDraw(id);
  }
}
