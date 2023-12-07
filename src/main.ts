import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'zhukeying',
      rolling: true,
      name: 'zhukeying.sid',
      cookie: { maxAge: 999 },
    }),
  );
  await app.listen(3000);
}
bootstrap();
