import { IsThereAnActiveSessionRes } from './../interfaces/is-there-an-active-session-res.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/nest_modules/auth-user/guards/admin.guard';
import { SessionService } from '../services/session.service';
import { WorkSession } from '../entities/work-session.entity';
import { StartSessionDTO } from '../interfaces/start-session-dto.interface';
import { DeliveryTimesRes } from '../interfaces/delivery-times-res.interface';
import { TimeIntervalsRes } from '../interfaces/time-intervals-res.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';

@Controller('api/work-session')
export class SessionController {

    constructor(private _session: SessionService) { }

    @UseGuards(AdminGuard)
    @Get('/get-active-session')
    public async getActiveSession(): Promise<WorkSession> {
        return await this._session.getActiveSession()
    }

    @Get('/is-there-an-active-session')
    public async isThereAnActiveSession(): Promise<IsThereAnActiveSessionRes> {
        return {
            isThereAnActiveSession: await this._session.isThereAnActiveSession()
        }
    }

    @Post('/start-new-session')
    public async startNewSession(@Body() startSessionDTO: StartSessionDTO): Promise<WorkSession> {
        return await this._session.startNewSession(startSessionDTO)
    }

    @Get('/get-delivery-times')
    public async getDeliveryTimes(): Promise<DeliveryTimesRes> {
        return {
            deliveryTimes: await this._session.getPublicSessionDeliveryTimes()
        }
    }

    @UseGuards(AdminGuard)
    @Get('/get-active-session-time-intervals')
    public async getActiveSessionTimeIntervals(): Promise<TimeIntervalsRes> {
        return {
            timeIntervals: await this._session.getActiveSessionTimeIntervals()
        }
    }

    @UseGuards(AdminGuard)
    @Get('/close')
    public async closeActiveSession(): Promise<ConfirmRes> {
        return await this._session.closeActiveSession()
    }


}
