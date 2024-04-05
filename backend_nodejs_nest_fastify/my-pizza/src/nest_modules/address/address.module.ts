import { Module } from '@nestjs/common';
import { AddressService } from './services/address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [AddressService]
})
export class AddressModule {}
