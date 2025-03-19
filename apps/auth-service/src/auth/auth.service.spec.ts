import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { User } from "./entities/user.entity";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: "1",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    password: "hashedPassword",
    isActive: true,
    metadata: null,
    refreshToken: null,
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue("test-secret"),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    const registerDto = {
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
    };

    it("should register a new user successfully", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce("access_token")
        .mockResolvedValueOnce("refresh_token");

      const result = await service.register(registerDto);

      expect(result).toEqual({
        access_token: "access_token",
        refresh_token: "refresh_token",
      });
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it("should throw ConflictException if user already exists", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("login", () => {
    const loginDto = {
      email: "test@example.com",
      password: "password123",
    };

    it("should login successfully with correct credentials", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(true));
      mockJwtService.signAsync
        .mockResolvedValueOnce("access_token")
        .mockResolvedValueOnce("refresh_token");

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: "access_token",
        refresh_token: "refresh_token",
      });
    });

    it("should throw UnauthorizedException with incorrect password", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, "compare")
        .mockImplementation(() => Promise.resolve(false));

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should throw UnauthorizedException with non-existent user", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("refresh", () => {
    const refreshTokenDto = {
      refreshToken: "valid_refresh_token",
    };

    it("should refresh tokens successfully", async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: "1",
        email: "test@example.com",
      });
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        refreshToken: "valid_refresh_token",
      });
      mockJwtService.signAsync
        .mockResolvedValueOnce("new_access_token")
        .mockResolvedValueOnce("new_refresh_token");

      const result = await service.refresh(refreshTokenDto);

      expect(result).toEqual({
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
      });
    });

    it("should throw UnauthorizedException with invalid refresh token", async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.refresh(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        refreshToken: null,
      });

      await service.logout("1");

      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        refreshToken: null,
      });
    });

    it("should not throw if user not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.logout("1")).resolves.not.toThrow();
    });
  });
});
