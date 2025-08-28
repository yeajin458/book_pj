import { NestFactory } from '@nestjs/core';
import { HelloModule } from './hello.module';

async function bootstrap() {
  const app = await NestFactory.create(HelloModule);
  await app.listen(5000);
  console.log('서버 시작! 포트 5000');
}

bootstrap();
