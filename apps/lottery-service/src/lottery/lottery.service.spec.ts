import { Test, TestingModule } from "@nestjs/testing";
import { LotteryService } from "./lottery.service";
import { DrawStatus } from "./interfaces/draw.interface";
import { NotFoundException, BadRequestException } from "@nestjs/common";

describe("LotteryService", () => {
  let service: LotteryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LotteryService],
    }).compile();

    service = module.get<LotteryService>(LotteryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new draw", async () => {
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };

      const result = await service.create(createDrawDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(createDrawDto.name);
      expect(result.description).toBe(createDrawDto.description);
      expect(result.status).toBe(DrawStatus.PENDING);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });
  });

  describe("findAll", () => {
    it("should return an array of draws", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      await service.create(createDrawDto);

      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("findOne", () => {
    it("should return a draw by id", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      const result = await service.findOne(created.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
    });

    it("should throw NotFoundException when draw not found", async () => {
      await expect(service.findOne("non-existent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("update", () => {
    it("should update a draw", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      const updateDrawDto = {
        description: "Updated Description",
      };

      const result = await service.update(created.id, updateDrawDto);
      expect(result.description).toBe(updateDrawDto.description);
      expect(result.updatedAt).not.toBe(created.updatedAt);
    });

    it("should throw NotFoundException when updating non-existent draw", async () => {
      const updateDrawDto = {
        description: "Updated Description",
      };

      await expect(
        service.update("non-existent-id", updateDrawDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should remove a draw", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      await service.remove(created.id);
      await expect(service.findOne(created.id)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw NotFoundException when removing non-existent draw", async () => {
      await expect(service.remove("non-existent-id")).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("startDraw", () => {
    it("should start a draw", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      const result = await service.startDraw(created.id);
      expect(result.status).toBe(DrawStatus.IN_PROGRESS);
    });

    it("should throw BadRequestException when starting a non-pending draw", async () => {
      // Create a test draw first
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      // Start the draw
      await service.startDraw(created.id);

      // Try to start it again
      await expect(service.startDraw(created.id)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("completeDraw", () => {
    it("should complete a draw with winning numbers", async () => {
      // Create and start a test draw
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);
      await service.startDraw(created.id);

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const result = await service.completeDraw(created.id, winningNumbers);

      expect(result.drawId).toBe(created.id);
      expect(result.winningNumbers).toEqual(winningNumbers);
      expect(result.timestamp).toBeDefined();
      expect(result.quantumSource).toBe(true);

      // Verify the draw status was updated
      const updatedDraw = await service.findOne(created.id);
      expect(updatedDraw.status).toBe(DrawStatus.COMPLETED);
      expect(updatedDraw.winningNumbers).toEqual(winningNumbers);
    });

    it("should throw BadRequestException when completing a non-in-progress draw", async () => {
      // Create a test draw
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      await expect(
        service.completeDraw(created.id, winningNumbers)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("cancelDraw", () => {
    it("should cancel a pending draw", async () => {
      // Create a test draw
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);

      const result = await service.cancelDraw(created.id);
      expect(result.status).toBe(DrawStatus.CANCELLED);
    });

    it("should throw BadRequestException when cancelling a completed draw", async () => {
      // Create and complete a test draw
      const createDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };
      const created = await service.create(createDrawDto);
      await service.startDraw(created.id);
      await service.completeDraw(created.id, [1, 2, 3, 4, 5, 6]);

      await expect(service.cancelDraw(created.id)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
