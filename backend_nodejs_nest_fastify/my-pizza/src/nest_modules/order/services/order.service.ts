import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { JwtUtilsService } from 'src/nest_modules/auth-user/services/jwt-utils.service';
import { OrderSet } from '../entities/order-set.entity';
import { Product } from 'src/nest_modules/product/entities/product.entity';
import { ToppingRef } from '../entities/topping-ref.entity';
import { ProductRef } from '../entities/product-ref.entity';
import { TimeInterval } from '../entities/time-interval.entity';
import { OrderInitDTO } from '../interfaces/order-init-dto.interface';
import { OrderInitRes } from '../interfaces/order-init-res.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderCheckoutInfo } from '../interfaces/order-checkout-info.interface';
import { FastifyRequest } from 'fastify';
import { UUID } from 'crypto';
import { SendOrderDTO } from '../interfaces/send-order-dto.interface';
import { ConfirmRes } from 'src/nest_modules/auth-user/interfaces/confirm-res.interface';
import { OrderRes } from '../interfaces/order-res-interface';
import { SessionService } from './session.service';

@Injectable()
export class OrderService {

    constructor(
        private jwtUtils: JwtUtilsService,
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(OrderSet) private orderSetRepository: Repository<OrderSet>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(ToppingRef) private toppingRefRepository: Repository<ToppingRef>,
        @InjectRepository(ProductRef) private productRefRepository: Repository<ProductRef>,
        @InjectRepository(TimeInterval) private timeIntervalrepository: Repository<TimeInterval>,
        private _session: SessionService
    ) { }

    public async orderInit(orderInitDTO: OrderInitDTO): Promise<OrderInitRes> {
        const order = new Order()
        order.status = OrderStatus.INIT
        await this.orderRepository.save(order)
        if (orderInitDTO.orderSetsDTO.length === 0)
            throw new BadRequestException('Order sent is empty')
        const ordersets: OrderSet[] = []
        for await (const orderSetDTO of orderInitDTO.orderSetsDTO) {
            const product = await this.productRepository.findOneBy({ id: orderSetDTO.productId })
            if (!product) {
                this.orderRepository.delete(order.id)
                throw new BadRequestException(`Product with id='${orderSetDTO.productId}' doesn't exist`)
            }
            if (orderSetDTO.quantity <= 0) {
                this.orderRepository.delete(order.id)
                throw new BadRequestException(`Product with id='${product.id}': quantity must be an integer number major than 0`)
            }
            product.setProductTotalAmount()
            const productRef = new ProductRef(product.name, product.price)
            productRef.toppingsRef = []
            if (product.toppings) {
                for await (const topping of product.toppings) {
                    const toppingRef = new ToppingRef(topping.name, topping.price)
                    await this.toppingRefRepository.save(toppingRef)
                    productRef.toppingsRef.push(toppingRef)
                }
            }
            await this.productRefRepository.save(productRef)
            const orderSet = new OrderSet(productRef, orderSetDTO.quantity)
            orderSet.order = order
            ordersets.push(orderSet)
        }
        await this.orderSetRepository.save(ordersets)
        await this.orderRepository.save(order)

        return {
            orderId: order.id,
            status: order.status
        }
    }

    public async getClientOrderInit(order: Order, req: FastifyRequest, guest?: boolean): Promise<OrderCheckoutInfo> {
        if (guest) {
            // da implementare
            return null
        } else {
            if (order.status !== OrderStatus.INIT) throw new BadRequestException('Order status must be INIT')
            const user = await this.jwtUtils.getUserFromReq(req)
            const address = user.addresses.find(address => address._default)
            if (!address) throw new BadRequestException('Cannot find default address, please set a default address before retrying')
            const totalAmount = order.orderSets.reduce((c, p) => c + p.productRef.price, 0) + order.deliveryCost
            return {
                orderId: order.id,
                address,
                orderSets: order.orderSets,
                status: order.status,
                deliveryCost: order.deliveryCost,
                totalAmount
            }
        }
    }

    private generateOrderResModel(order: Order): OrderRes {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, timeInterval, ...otherProps } = order
        return {
            id,
            ...otherProps
        }
    }

    public async getOrderById(id: UUID): Promise<OrderRes> {
        const order = await this.orderRepository.findOneBy({ id })
        if (!order) throw new NotFoundException(`Order with id='${id}' not found`)
        return this.generateOrderResModel(order)
    }

    public async sendOrder(sendOrderDTO: SendOrderDTO, req: FastifyRequest, /* guest?: boolean */): Promise<ConfirmRes> {
        const order = await this.orderRepository.findOneBy({ id: sendOrderDTO.orderId })
        if (!order) throw new BadRequestException("Order you're trying to send doesn't exist")
        if (order.status !== OrderStatus.INIT) // controllo da implementare
            throw new BadRequestException("An order must have INIT status to be sent")
        order.status = OrderStatus.PENDING
        const user = await this.jwtUtils.getUserFromReq(req)
        order.user = user
        order.address = sendOrderDTO.address
        order.asap = sendOrderDTO.asap
        order.expectedDeliveryTime = sendOrderDTO.expectedDeliveryTime
        await this.orderRepository.save(order)
        return {
            message: "Order with id='" + sendOrderDTO.orderId + " confirmed successfully",
            statusCode: HttpStatus.OK,
            timestamp: new Date().getTime()
        }

    }

    public async confirmOrder(orderId: UUID, timeIntervalId: UUID): Promise<ConfirmRes> {
        const timeInterval = await this.timeIntervalrepository.findOneBy({ id: timeIntervalId })
        if (!timeInterval) throw new BadRequestException("TimeInterval with id='" + timeIntervalId + "' doesn't exist")
        const order = await this.orderRepository.findOneBy({ id: orderId })
        if (!order) throw new BadRequestException("Order with id='" + orderId + "' doesn't exist")
        order.timeInterval = timeInterval
        order.status = OrderStatus.ACCEPTED
        order.deliveryTime = timeInterval.endsAt
        await this.orderRepository.save(order)
        return {
            message: "order with id ='" + orderId + "' confirmed successfully",
            timestamp: new Date().getTime(),
            statusCode: HttpStatus.OK
        }
    }

    public async rejectOrder(orderId: UUID): Promise<ConfirmRes> {
        const order = await this.orderRepository.findOneBy({ id: orderId })
        if (!order) throw new BadRequestException("Order with id='" + orderId + "' doesn't exist")
        if (order.status !== OrderStatus.PENDING)
            throw new BadRequestException('An order must have PENDING status to be confirmed or rejected')
        order.status = OrderStatus.REJECTED
        await this.orderRepository.save(order)
        return {
            message: "Order with id='" + orderId + " rejected",
            timestamp: new Date().getTime(),
            statusCode: HttpStatus.OK
        }
    }

    public async completeOrder(orderId: UUID): Promise<TimeInterval[]> {
        const order = await this.orderRepository.findOneBy({ id: orderId })
        if (!order) throw new BadRequestException("Order with id='" + orderId + "' doesn't exist")
        if (order.status !== OrderStatus.ACCEPTED)
            throw new BadRequestException('An order must have ACCEPTED status to be set as completed')
        order.status = OrderStatus.COMPLETED
        order.completedAt = new Date().getTime()
        await this.orderRepository.save(order)
        return await this._session.getActiveSessionTimeIntervals()
    }


}
