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

@Controller("lottery")
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  create(@Body() createDrawDto: CreateDrawDto): Promise<Draw> {
    return this.lotteryService.create(createDrawDto);
  }

  @Get()
  findAll(): Promise<Draw[]> {
    return this.lotteryService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDrawDto: UpdateDrawDto
  ): Promise<Draw> {
    return this.lotteryService.update(id, updateDrawDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.lotteryService.remove(id);
  }

  @Post(":id/start")
  startDraw(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.startDraw(id);
  }

  @Post(":id/complete")
  completeDraw(
    @Param("id") id: string,
    @Body("winningNumbers") winningNumbers: number[]
  ): Promise<DrawResult> {
    return this.lotteryService.completeDraw(id, winningNumbers);
  }

  @Post(":id/cancel")
  cancelDraw(@Param("id") id: string): Promise<Draw> {
    return this.lotteryService.cancelDraw(id);
  }
}
