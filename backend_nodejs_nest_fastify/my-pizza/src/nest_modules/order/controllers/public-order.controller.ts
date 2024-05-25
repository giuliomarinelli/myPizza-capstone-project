import { Controller, Get, Post, Req, Res, BadRequestException, Query, Body } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderInitDTO } from '../interfaces/order-init-dto.interface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { OrderInitRes } from '../interfaces/order-init-res.interface';
import { ConfigService } from '@nestjs/config';
import { GetOrderIdRes } from '../interfaces/get-order-id-res.interface';
import { UUID } from 'crypto';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderCheckoutInfo } from '../interfaces/order-checkout-info.interface';
import { SendOrderDTO } from '../interfaces/send-order-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';

@Controller('public')
export class PublicOrderController {

    constructor(private orderSvc: OrderService, private configSvc: ConfigService, private dataSource: DataSource) { }

    @Post('/order-init')
    public async orderInit(@Body() orderInitDTO: OrderInitDTO, @Res({ passthrough: true }) res: FastifyReply): Promise<OrderInitRes> {
        const _res = await this.orderSvc.orderInit(orderInitDTO)
        res.setCookie('__order_id', _res.orderId, {
            domain: this.configSvc.get('COOKIE.domain'),
            sameSite: this.configSvc.get('COOKIE.sameSite'),
            httpOnly: true,
            path: '/',
            secure: true,
            maxAge: this.configSvc.get('EXP.refreshTokenExp')
        })
        return _res
    }

    @Get('/get-client-order-id')
    public async getOrderId(@Req() req: FastifyRequest): Promise<GetOrderIdRes> {
        let orderId: UUID
        try {
            orderId = <UUID>req.cookies['__order_id']
        } catch {
            throw new BadRequestException('Invalid UUID model')
        }
        if (!orderId) throw new BadRequestException('Missing __order_id cookie')
        const order = await this.dataSource.getRepository(Order).findOneBy({ id: orderId })
        if (!order) throw new BadRequestException("orderId from __order_id cookie refers to an order that doesn't exist")
        return {
            orderId
        }
    }

    @Get('/get-client-order-init')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getClientOrder(@Req() req: FastifyRequest, @Query('guest') guest: boolean = false): Promise<OrderCheckoutInfo> {
        let orderId: UUID
        try {
            orderId = <UUID>req.cookies['__order_id']
        } catch {
            throw new BadRequestException('Invalid UUID model')
        }
        if (!orderId) throw new BadRequestException('Missing __order_id cookie')
        const order = await this.dataSource.getRepository(Order).findOneBy({ id: orderId })
        if (!order) throw new BadRequestException("orderId from __order_id cookie refers to an order that doesn't exist")
        return await this.orderSvc.getClientOrderInit(order, req)
    }

    @Post('/send-order')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async sendOrder(@Query('guest') guest: boolean = false,
        @Body() sendOrderDTO: SendOrderDTO, @Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<ConfirmRes> {

        const confirm = await this.orderSvc.sendOrder(sendOrderDTO, req)
        res.clearCookie('__order_id')
        return confirm
    }

}
