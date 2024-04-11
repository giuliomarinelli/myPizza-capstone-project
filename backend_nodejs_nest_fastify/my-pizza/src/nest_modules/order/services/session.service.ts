import { BadRequestException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeInterval } from '../entities/time-interval.entity';
import { Repository } from 'typeorm';
import { WorkSession } from '../entities/work-session.entity';
import { StartSessionDTO } from '../interfaces/start-session-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';

@Injectable()
export class SessionService {

    constructor(
        @InjectRepository(TimeInterval) private timeIntervalRepository: Repository<TimeInterval>,
        @InjectRepository(WorkSession) private workSessionRepository: Repository<WorkSession>
    ) { }

    public async getPublicSessionDeliveryTimes(): Promise<number[]> {
        const activeSession = await this.workSessionRepository.findOne({ where: { active: true } })
        if (!activeSession) throw new BadRequestException("There isn't an active session at the moment")
        if (!activeSession.timeIntervals) activeSession.timeIntervals = []
        const deliveryTimes: number[] = []
        activeSession.timeIntervals.map(ti => deliveryTimes.push(ti.startsAt))
        deliveryTimes.push(activeSession.timeIntervals[activeSession.timeIntervals.length - 1].endsAt)
        return deliveryTimes
    }

    public async getActiveSessionTimeIntervals(): Promise<TimeInterval[]> {
        let timeIntervals = (await this.getActiveSession()).timeIntervals
        if (!timeIntervals) timeIntervals = []
        return timeIntervals
    }

    public async isThereAnActiveSession(): Promise<boolean> {
        return !!await this.getActiveSession()
    }

    public async getActiveSession(): Promise<WorkSession> {
        const activeSession = await this.workSessionRepository.findOneBy({ active: true })
        if (!activeSession) throw new BadRequestException("There isn't an active session at the moment")
        return activeSession
    }

    public async startNewSession(startSessionDTO: StartSessionDTO): Promise<WorkSession> {
        await this.workSessionRepository.save((await this.workSessionRepository.find()).map(session => {
            if (session.active) session.active = false
            return session
        }))
        const session = new WorkSession(startSessionDTO.type, startSessionDTO.openTime,
            startSessionDTO.closeTime, startSessionDTO.cookCount, startSessionDTO.ridersCount)
        session.active = true
        await this.workSessionRepository.save(session)
        const timeIntervals = TimeInterval.getTimeIntervals(startSessionDTO.openTime, startSessionDTO.closeTime)
        await this.timeIntervalRepository.save(timeIntervals)
        session.timeIntervals = timeIntervals
        return await this.workSessionRepository.save(session)
    }

    public async closeActiveSession(): Promise<ConfirmRes> {
        const activeSession = await this.getActiveSession()
        activeSession.active = false
        await this.workSessionRepository.save(activeSession)
        return {
            message: "Working session with id='" + activeSession.id + "' successfully closed",
            timestamp: new Date().getTime(),
            statusCode: HttpStatus.OK
        }
    }

}
