import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ExecutionContext } from "@nestjs/common";

jest.mock("@nestjs/passport", () => ({
  AuthGuard: () => {
    return class {
      canActivate() {
        return true;
      }
    };
  },
}));

describe("JwtAuthGuard", () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should allow access when token is valid", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer valid_token",
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBeTruthy();
  });
});
