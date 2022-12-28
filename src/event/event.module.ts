import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { PrismaService } from "src/_utils/service/prisma.service";
import { EventResource } from "./event.resource";
import { CloudinaryModule } from "src/_utils/service/cloudinary/cloudinary.module";
import { Model } from "src/_utils/constants";

@Module({
  imports: [CloudinaryModule],
  controllers: [EventController],
  providers: [
    EventService,
    PrismaService,
    EventResource,
    {
      provide: Model.provider_token,
      useValue: Model.EVENT,
    },
  ],
  exports: [EventService],
})
export class EventModule {}
