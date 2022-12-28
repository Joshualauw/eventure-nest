import { Module } from "@nestjs/common";
import { ItinenaryService } from "./itinenary.service";
import { ItinenaryController } from "./itinenary.controller";
import { PrismaService } from "src/_utils/service/prisma.service";
import { Model } from "src/_utils/constants";

@Module({
  controllers: [ItinenaryController],
  providers: [
    ItinenaryService,
    PrismaService,
    {
      provide: Model.provider_token,
      useValue: Model.ITINENARY,
    },
  ],
})
export class ItinenaryModule {}
