import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => new PrismaClient(),
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}

export { AppController, AppService };
