import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './config/swagger.config';
import { initVersioning } from './config/versioning.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  initVersioning(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
