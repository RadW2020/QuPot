import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { Draw, DrawStatus, DrawResult } from "./interfaces/draw.interface";
import { CreateDrawDto } from "./dto/create-draw.dto";
import { UpdateDrawDto } from "./dto/update-draw.dto";

@Injectable()
export class LotteryService {
  private draws: Draw[] = [];

  async create(createDrawDto: CreateDrawDto): Promise<Draw> {
    const draw: Draw = {
      id: uuidv4(),
      ...createDrawDto,
      status: createDrawDto.status
        ? DrawStatus[createDrawDto.status as keyof typeof DrawStatus]
        : DrawStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.draws.push(draw);
    return draw;
  }

  async findAll(): Promise<Draw[]> {
    return this.draws;
  }

  async findOne(id: string): Promise<Draw> {
    const draw = this.draws.find((d) => d.id === id);
    if (!draw) {
      throw new NotFoundException(`Draw with ID ${id} not found`);
    }
    return draw;
  }

  async update(id: string, updateDrawDto: UpdateDrawDto): Promise<Draw> {
    const index = this.draws.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Draw with ID ${id} not found`);
    }

    this.draws[index] = {
      ...this.draws[index],
      ...updateDrawDto,
      status: updateDrawDto.status
        ? DrawStatus[updateDrawDto.status as keyof typeof DrawStatus]
        : this.draws[index].status,
      updatedAt: new Date(),
    };

    return this.draws[index];
  }

  async remove(id: string): Promise<void> {
    const index = this.draws.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Draw with ID ${id} not found`);
    }
    this.draws.splice(index, 1);
  }

  async startDraw(id: string): Promise<Draw> {
    const draw = await this.findOne(id);

    if (draw.status !== DrawStatus.PENDING) {
      throw new BadRequestException(`Draw ${id} is not in PENDING status`);
    }

    draw.status = DrawStatus.IN_PROGRESS;
    draw.updatedAt = new Date();

    return draw;
  }

  async completeDraw(
    id: string,
    winningNumbers: number[]
  ): Promise<DrawResult> {
    const draw = await this.findOne(id);

    if (draw.status !== DrawStatus.IN_PROGRESS) {
      throw new BadRequestException(`Draw ${id} is not in IN_PROGRESS status`);
    }

    draw.status = DrawStatus.COMPLETED;
    draw.winningNumbers = winningNumbers;
    draw.updatedAt = new Date();

    const result: DrawResult = {
      drawId: draw.id,
      winningNumbers,
      timestamp: new Date(),
      quantumSource: true, // TODO: Implement quantum number generation
    };

    return result;
  }

  async cancelDraw(id: string): Promise<Draw> {
    const draw = await this.findOne(id);

    if (draw.status === DrawStatus.COMPLETED) {
      throw new BadRequestException(`Cannot cancel a completed draw`);
    }

    draw.status = DrawStatus.CANCELLED;
    draw.updatedAt = new Date();

    return draw;
  }
}
