import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppModule } from "../src/app.module";
import { User } from "../src/auth/entities/user.entity";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.test",
        }),
        TypeOrmModule.forRoot({
          type: "postgres",
          host: process.env.DB_HOST || "localhost",
          port: parseInt(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME || "postgres",
          password: process.env.DB_PASSWORD || "postgres",
          database: process.env.DB_NAME || "auth_service_test",
          entities: [User],
          synchronize: true,
          dropSchema: true, // Limpiar la base de datos antes de las pruebas
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Authentication Flow", () => {
    const testUser = {
      email: "test@example.com",
      password: "Test123!",
      firstName: "Test",
      lastName: "User",
    };

    it("should register a new user", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.refresh_token).toBeDefined();
          accessToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
        });
    });

    it("should not register the same user twice", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send(testUser)
        .expect(409);
    });

    it("should login with correct credentials", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.refresh_token).toBeDefined();
          accessToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
        });
    });

    it("should not login with incorrect password", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);
    });

    it("should refresh tokens", () => {
      return request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refresh_token: refreshToken })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.refresh_token).toBeDefined();
          expect(res.body.access_token).not.toBe(accessToken);
          expect(res.body.refresh_token).not.toBe(refreshToken);
        });
    });

    it("should not refresh with invalid token", () => {
      return request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refresh_token: "invalid-token" })
        .expect(401);
    });

    it("should logout successfully", () => {
      return request(app.getHttpServer())
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
    });

    it("should not allow access after logout", () => {
      return request(app.getHttpServer())
        .post("/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(401);
    });
  });

  describe("Validation", () => {
    it("should not register with invalid email", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "invalid-email",
          password: "Test123!",
          firstName: "Test",
          lastName: "User",
        })
        .expect(400);
    });

    it("should not register with short password", () => {
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({
          email: "test@example.com",
          password: "123",
          firstName: "Test",
          lastName: "User",
        })
        .expect(400);
    });
  });
});
