import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SERVICE_PORTS } from "@common/constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(SERVICE_PORTS.AUTH_SERVICE);
}
bootstrap();
