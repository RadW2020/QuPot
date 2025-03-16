import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SERVICE_PORTS } from "@qupot/common-lib";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Añadir prefijo global
  app.setGlobalPrefix("api/v1");

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("Auth Service API")
    .setDescription("API documentation for the Authentication Service")
    .setVersion("1.0")
    .addTag("auth")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  await app.listen(SERVICE_PORTS.AUTH_SERVICE);
}
bootstrap();
