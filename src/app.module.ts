import { Module } from '@nestjs/common';
import { Grpc, Events } from '@coolcinema/foundation';
import { Registry } from '@coolcinema/contracts';

import { GatewayEventsDefinition } from './_gen/grpc/events/events';
import { SalesServiceDefinition } from './_gen/grpc/sales-service_grpc_sales';

import { AppController } from './app.controller';
import { NewServiceDefinition } from './_gen/grpc/new-service_grpc_new';

@Module({
  imports: [
    Grpc.Nest.Module.forRoot(Registry, {
      new: NewServiceDefinition,
      sales: SalesServiceDefinition,
    }),

    Events.Nest.Module.register({
      name: 'GATEWAY_EVENTS',
      definitions: GatewayEventsDefinition,
      registry: Registry,
      prefix: 'gateway',
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
