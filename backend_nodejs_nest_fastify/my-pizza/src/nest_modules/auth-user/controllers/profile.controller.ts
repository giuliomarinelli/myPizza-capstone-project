import { Controller, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UserRes } from '../interfaces/user-res.interface';
import { ProfileService } from '../services/profile.service';
import { IsLoggedInRes } from '../interfaces/is-logged-in-res.interface';
import { AdminUserIdRes } from '../interfaces/admin-user-id-res-interface';
import { AuthoritiesRes } from '../interfaces/authorities-res.interface';

@Controller('api/user-profile')
export class ProfileController {

    constructor(private profileSvc: ProfileService) { }

    @Get()
    public async getProfile(@Req() req: FastifyRequest): Promise<UserRes> {
        return this.profileSvc.getProfile(req)
    }

    @Get('/is-logged-in')
    public isLoggedIn(): IsLoggedInRes {
        return {
            loggedIn: true
        }
    }

    @Get('/get-admin-userid')
    public async getAdminUserId(): Promise<AdminUserIdRes> {
        return await this.profileSvc.getAdminUserId()
    }

    @Get('/get-authorities')
    public async getAuthorities(@Req() res: FastifyRequest): Promise<AuthoritiesRes> {
        return await this.profileSvc.getAuthorities(res)
    }



    



}
