import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './config/swagger.config';
import { initVersioning } from './config/versioning.config';
import { initCorsConfig } from './config/cors.config';
import { initErrorMapper } from './config/error-mapper.config';
import { initValidationPipe } from './config/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  initVersioning(app);
  initCorsConfig(app);
  initErrorMapper(app);
  initValidationPipe(app);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
