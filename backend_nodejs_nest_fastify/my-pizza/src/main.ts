import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: ['http://localhost:4200'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      }
    })
  await app.register(fastifyCookie, {
    secret: 'my-secret', // ... variabili d'ambiente
  })

  const logger = new Logger('Bootstrap')
  logger.log('MyPizza Backend Node.js Application')

  const configSvc =  app.get<ConfigService>(ConfigService)
  
  await app.listen(configSvc.get('APP.port'));

}
bootstrap();
