import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("API Gateway");

  try {
    const app = await NestFactory.create(AppModule);

    // Configuración de CORS
    app.enableCors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.ALLOWED_ORIGINS?.split(",")
          : "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    });

    // Configuración de validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    );

    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle("QuPot API Gateway")
      .setDescription("API Gateway para los servicios de QuPot")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Servicios de autenticación")
      .addTag("lottery", "Servicios de lotería")
      .addTag("quantum", "Servicios cuánticos")
      .addTag("blockchain", "Servicios de blockchain")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/v1/docs", app, document);

    // Start the server
    const port = process.env.PORT || 8000;
    await app.listen(port);

    logger.log(`🚀 API Gateway iniciado en el puerto ${port}`);
    logger.log(
      `📚 Documentación Swagger disponible en http://localhost:${port}/api/v1/docs`
    );
  } catch (error) {
    logger.error("Error al iniciar el API Gateway:", error);
    process.exit(1);
  }
}

bootstrap();
