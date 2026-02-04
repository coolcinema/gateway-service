import { BuyTicketRequest, BuyTicketResponse } from './_gen/grpc/http/api';
import { GatewayEventsClient } from './_gen/grpc/events/events';
import { Events } from '@coolcinema/foundation';
import { Controller, Inject, Post, Body, HttpException } from '@nestjs/common';
import { type NewServiceClient } from './_gen/grpc/new-service_grpc_new';
import { type ThreeServiceClient } from './_gen/grpc/three-service_grpc_three';

@Controller('v1')
export class AppController {
  constructor(
    @Inject('newService') private newS: NewServiceClient,
    @Inject('threeService') private sales: ThreeServiceClient,
    @Inject('GATEWAY_EVENTS')
    private events: Events.EventsPublisher<GatewayEventsClient>,
  ) {}

  @Post('buy-ticket')
  async buyTicket(@Body() body: BuyTicketRequest): Promise<BuyTicketResponse> {
    const user = await this.newS.getUser({ id: body.userId });
    if (!user.isActive) throw new HttpException('User blocked', 403);

    const priceInfo = await this.sales.calculatePrice({
      showtimeId: body.showtimeId,
    });

    await this.events.ticketSold({
      ticketId: 't-123',
      userId: user.id,
      showtimeId: body.showtimeId,
      price: priceInfo.amount,
    });

    return {
      success: true,
      ticketId: 't-123',
      price: priceInfo.amount,
    };
  }
}
