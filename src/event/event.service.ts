import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ApiStatus } from "src/_utils/constants";
import { CloudinaryService } from "src/_utils/service/cloudinary/cloudinary.service";
import { PrismaService } from "src/_utils/service/prisma.service";
import { CreateEventDto } from "./dto/CreateEventDto";
import { EventResource } from "./event.resource";

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private eventResource: EventResource,
    private cloudinary: CloudinaryService,
  ) {}

  async getManagedEvents(user_id: string) {
    try {
      const events = await this.prisma.event.findMany({
        where: { user_id },
        include: {
          user: { select: { username: true, id: true } },
          itinenaries: { take: 1, select: { day: true, activity: { select: { start_time: true } } } },
          participants: true,
          transactions: true,
        },
      });
      return events.map((e) => this.eventResource.transformManagedEvent(e));
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async getAttendedEvents(user_id: string) {
    try {
      const events = await this.prisma.event.findMany({
        where: { participants: { some: { user_id: user_id } } },
        select: {
          id: true,
          background: true,
          title: true,
          itinenaries: { take: 1, select: { day: true, activity: { select: { start_time: true } } } },
        },
      });
      return events.map((e) => this.eventResource.transformHomeEvent(e));
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async createEvent(payload: CreateEventDto, user_id: string) {
    try {
      let event = await this.prisma.event.create({ data: { user_id: user_id, ...payload } });

      if (event) {
        if (payload.background) {
          const image_url = await this.cloudinary.singleUpload(payload.background, "event_background", event.id);
          event = await this.prisma.event.update({ where: { id: event.id }, data: { background: image_url } });
        }
        if (payload.event_images) {
          let temp = [] as string[];
          for (let i = 0; i < payload.event_images.length; i++) {
            const image_url = await this.cloudinary.singleUpload(
              payload.event_images[i],
              "event_images",
              event.id + "_" + (i + 1),
            );
            temp.push(image_url);
          }
          event = await this.prisma.event.update({ where: { id: event.id }, data: { event_images: temp } });
        }
        await this.prisma.form.create({ data: { event_id: event.id, name: "default", type: "registration" } });
        await this.prisma.form.create({ data: { event_id: event.id, name: "default", type: "survey" } });
      }

      return event;
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.CREATE_FAILED);
    }
  }

  async getHomeEvents(query: any) {
    try {
      const events = await this.prisma.event.findMany({
        where: query,
        select: {
          id: true,
          title: true,
          category: true,
          price: true,
          venue: true,
          background: true,
          coordinate: true,
          itinenaries: { take: 1, select: { day: true, activity: { select: { start_time: true } } } },
        },
      });
      return events.map((e) => this.eventResource.transformHomeEvent(e));
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async getOneEvent(id: string) {
    try {
      const event = await this.prisma.event.findFirst({
        where: { id },
        include: {
          wishlists: { select: { user_id: true } },
          user: { select: { username: true, id: true } },
          participants: true,
          transactions: true,
          sponsors: { select: { brand_logo: true } },
          itinenaries: { select: { day: true, activity: true } },
        },
      });
      return this.eventResource.transformOneEvent(event);
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }
}
