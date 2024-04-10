import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io'


// import { AddressService } from './nest_modules/address/services/address.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )
  const configSvc = app.get<ConfigService>(ConfigService)

  // const addressSvc = app.get<AddressService>(AddressService)
  // await addressSvc.fillCityTableFromDataSets()

  

  await app.register(fastifyCookie, {
    secret: configSvc.get('KEYS.cookieSignSecret')
  })

  app.enableCors({
    origin: configSvc.get('APP.corsOrigins'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })

  app.useWebSocketAdapter(new IoAdapter(app));

  const logger = new Logger('Bootstrap')

  await app.listen(configSvc.get('APP.port'));

  logger.log(`App listening on the same port (${configSvc.get('APP.port')}) for Fastify and Socket.io`)

}
bootstrap();
