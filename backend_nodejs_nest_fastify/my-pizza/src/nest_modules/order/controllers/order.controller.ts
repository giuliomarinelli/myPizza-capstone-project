import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { AdminGuard } from 'src/nest_modules/auth-user/guards/admin.guard';
import { UUID } from 'crypto';
import { OrderRes } from '../interfaces/order-res-interface';
import { ConfirmOrderDTO } from '../interfaces/confirm-order-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { TimeInterval } from '../entities/time-interval.entity';

@Controller('api/order')
@UseGuards(AdminGuard)
export class OrderController {

    constructor(private orderSvc: OrderService) { }

    
    @Get('/:orderId')
    public async getOrderById(@Param('orderId') orderId: UUID): Promise<OrderRes> {
        return await this.orderSvc.getOrderById(orderId)
    }

    
    @Post('/confirm')
    public async confirmOrder(@Body() confirmOrderDTO: ConfirmOrderDTO): Promise<ConfirmRes> {
        return await this.orderSvc.confirmOrder(confirmOrderDTO.orderId, confirmOrderDTO.timeIntervalId)
    }

    @Get('/:orderId/reject')
    public async rejectOrder(@Param('orderId') orderId: UUID): Promise<ConfirmRes> {
        return await this.rejectOrder(orderId)
    }
    
    @Get('/:orderId/set-completed')
    public async completeOrder(@Param('orderId') orderId: UUID): Promise<TimeInterval[]> {
        return await this.orderSvc.completeOrder(orderId)
    }

}
