/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: ['http://localhost:4200'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      }
    });

  await app.register(fastifyCookie, {
    secret: 'my-secret', // ... variabili d'ambiente
  });
  await app.listen(3000);
}
bootstrap();
