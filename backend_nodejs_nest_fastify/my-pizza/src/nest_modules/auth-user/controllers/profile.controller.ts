import { Controller, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserRes } from '../interfaces/user-res.interface';
import { ProfileService } from '../services/profile.service';

@Controller('api/user-profile')
export class ProfileController {

    constructor(private profileSvc: ProfileService) { }

    @Get()
    public async getProfile(@Req() req: FastifyRequest): Promise<UserRes> {
        return this.profileSvc.getProfile(req)
    }

}
