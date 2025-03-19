import { Test, TestingModule } from "@nestjs/testing";
import { LotteryController } from "./lottery.controller";
import { LotteryService } from "./lottery.service";
import { DrawStatus } from "./interfaces/draw.interface";
import { CreateDrawDto } from "./dto/create-draw.dto";
import { UpdateDrawDto } from "./dto/update-draw.dto";

describe("LotteryController", () => {
  let controller: LotteryController;
  let service: LotteryService;

  const mockLotteryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    startDraw: jest.fn(),
    completeDraw: jest.fn(),
    cancelDraw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryController],
      providers: [
        {
          provide: LotteryService,
          useValue: mockLotteryService,
        },
      ],
    }).compile();

    controller = module.get<LotteryController>(LotteryController);
    service = module.get<LotteryService>(LotteryService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new draw", async () => {
      const createDrawDto: CreateDrawDto = {
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
      };

      const expectedResult = {
        id: "test-id",
        ...createDrawDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLotteryService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDrawDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDrawDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of draws", async () => {
      const expectedResult = [
        {
          id: "test-id",
          name: "Test Draw",
          description: "Test Description",
          startDate: new Date(),
          endDate: new Date(),
          status: DrawStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockLotteryService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a draw by id", async () => {
      const id = "test-id";
      const expectedResult = {
        id,
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLotteryService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    it("should update a draw", async () => {
      const id = "test-id";
      const updateDrawDto: UpdateDrawDto = {
        description: "Updated Description",
      };

      const expectedResult = {
        id,
        name: "Test Draw",
        description: "Updated Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLotteryService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDrawDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateDrawDto);
    });
  });

  describe("remove", () => {
    it("should remove a draw", async () => {
      const id = "test-id";

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe("startDraw", () => {
    it("should start a draw", async () => {
      const id = "test-id";
      const expectedResult = {
        id,
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.IN_PROGRESS,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLotteryService.startDraw.mockResolvedValue(expectedResult);

      const result = await controller.startDraw(id);

      expect(result).toEqual(expectedResult);
      expect(service.startDraw).toHaveBeenCalledWith(id);
    });
  });

  describe("completeDraw", () => {
    it("should complete a draw with winning numbers", async () => {
      const id = "test-id";
      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const expectedResult = {
        drawId: id,
        winningNumbers,
        timestamp: new Date(),
        quantumSource: true,
      };

      mockLotteryService.completeDraw.mockResolvedValue(expectedResult);

      const result = await controller.completeDraw(id, winningNumbers);

      expect(result).toEqual(expectedResult);
      expect(service.completeDraw).toHaveBeenCalledWith(id, winningNumbers);
    });
  });

  describe("cancelDraw", () => {
    it("should cancel a draw", async () => {
      const id = "test-id";
      const expectedResult = {
        id,
        name: "Test Draw",
        description: "Test Description",
        startDate: new Date(),
        endDate: new Date(),
        status: DrawStatus.CANCELLED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockLotteryService.cancelDraw.mockResolvedValue(expectedResult);

      const result = await controller.cancelDraw(id);

      expect(result).toEqual(expectedResult);
      expect(service.cancelDraw).toHaveBeenCalledWith(id);
    });
  });
});
