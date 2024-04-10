import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    const registerDto: CreateUserDto = {
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
    };

    it("should register a new user", async () => {
      const expectedResult = {
        access_token: "access_token",
        refresh_token: "refresh_token",
      };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    it("should login user", async () => {
      const expectedResult = {
        access_token: "access_token",
        refresh_token: "refresh_token",
      };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe("refresh", () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: "valid_refresh_token",
    };

    it("should refresh tokens", async () => {
      const expectedResult = {
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
      };
      mockAuthService.refresh.mockResolvedValue(expectedResult);

      const result = await controller.refresh(refreshTokenDto);

      expect(result).toEqual(expectedResult);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe("logout", () => {
    it("should logout user", async () => {
      const req = { user: { userId: "1" } };
      await controller.logout(req);

      expect(mockAuthService.logout).toHaveBeenCalledWith("1");
    });
  });
});
