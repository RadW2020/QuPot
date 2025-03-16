import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // Enable CORS
  app.enableCors();

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("QuPot API Gateway")
    .setDescription("API Gateway for the QuPot Quantum Lottery Platform")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Start the server
  const port = process.env.PORT || 8000;
  await app.listen(port);

  logger.log(`🚀 API Gateway started on port ${port}`);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${port}/api/docs`
  );
}

bootstrap();
