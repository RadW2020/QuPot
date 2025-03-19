import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8003);
  console.log("🚀 Lottery service running on port 8003");
}
bootstrap();
