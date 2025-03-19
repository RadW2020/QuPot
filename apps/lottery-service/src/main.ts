import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("Lottery Service API")
    .setDescription("API for managing lottery draws")
    .setVersion("1.0")
    .addTag("lottery")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  await app.listen(8003);
  console.log("🚀 Lottery service running on port 8003");
  console.log(
    "📚 Swagger documentation available at http://localhost:8003/api/v1/docs"
  );
}
bootstrap();
