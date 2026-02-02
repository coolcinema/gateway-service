import { Module } from '@nestjs/common';
import { Grpc, Events } from '@coolcinema/foundation';
import { Registry } from '@coolcinema/contracts';

import { GatewayEventsDefinition } from './_gen/grpc/events/events';
import { IdentityServiceDefinition } from './_gen/grpc/identity-service_grpc_identity';
import { SalesServiceDefinition } from './_gen/grpc/sales-service_grpc_sales';

import { AppController } from './app.controller';

@Module({
  imports: [
    Grpc.Nest.Module.forRoot(Registry, {
      identity: IdentityServiceDefinition,
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
