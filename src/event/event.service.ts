import { Injectable } from "@nestjs/common";
import { InternalServerErrorException, BadRequestException } from "@nestjs/common/exceptions";
import { Event, Prisma, Wishlist } from "@prisma/client";
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

  async getManagedEvents(user_id: string): Promise<any> {
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
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async getAttendedEvents(user_id: string): Promise<any> {
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
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async uploadEventImages(background: string, event_images: string[], event_id: string): Promise<Event> {
    let eventWithImages: any;

    if (background) {
      const image_url = await this.cloudinary.singleUpload(background, "event_background", event_id);
      eventWithImages = await this.prisma.event.update({ where: { id: event_id }, data: { background: image_url } });
    }
    if (event_images) {
      let temp = [] as string[];
      for (let i = 0; i < event_images.length; i++) {
        const image_url = await this.cloudinary.singleUpload(event_images[i], "event_images", event_id + "_" + (i + 1));
        temp.push(image_url);
      }
      eventWithImages = await this.prisma.event.update({ where: { id: event_id }, data: { event_images: temp } });
    }

    return eventWithImages;
  }

  async getWishlistEvents(user_id: string): Promise<any> {
    try {
      const events = await this.prisma.event.findMany({
        where: { wishlists: { some: { user_id } } },
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
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async setWishlist(id: string, user_id: string): Promise<{ data: Event; message: string }> {
    try {
      let message = "event added to wishlist";
      const event = await this.prisma.event.findFirst({ where: { id: id } });
      if (event) {
        const wishlist = await this.prisma.wishlist.findFirst({ where: { event_id: id } });
        if (wishlist) {
          await this.prisma.wishlist.delete({ where: { id: wishlist.id } });
          message = "event removed from wishlist";
        } else {
          await this.prisma.wishlist.create({ data: { event_id: id, user_id: user_id } });
        }
      }

      return { data: event, message };
    } catch (e: any) {
      throw new InternalServerErrorException("set wishlist failed");
    }
  }

  async updateEvent(payload: CreateEventDto, id: string): Promise<Event> {
    try {
      let event = await this.prisma.event.update({ where: { id }, data: payload });
      event = await this.uploadEventImages(payload.background, payload.event_images, event.id);

      return event;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.UPDATE_FAILED);
    }
  }

  async createEvent(payload: CreateEventDto, user_id: string): Promise<Event> {
    try {
      let event = await this.prisma.event.create({ data: { user_id: user_id, ...payload } });

      if (event) {
        event = await this.uploadEventImages(payload.background, payload.event_images, event.id);
        await this.prisma.form.create({ data: { event_id: event.id, name: "default", type: "registration" } });
        await this.prisma.form.create({ data: { event_id: event.id, name: "default", type: "survey" } });
      }

      return event;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.CREATE_FAILED);
    }
  }

  async getHomeEvents(query: any): Promise<any> {
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
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async openEvent(id: string): Promise<any> {
    try {
      const forms = await this.prisma.form.findMany({
        where: { event_id: id, type: "registration" },
      });
      if (forms[0].fields.length == 0) {
        throw new BadRequestException("registration form must be present");
      }
      await this.prisma.event.update({ where: { id }, data: { status: true } });
    } catch (e: any) {
      throw new InternalServerErrorException("open event failed");
    }
  }

  async closeEvent(id: string): Promise<any> {}

  async getOneEvent(id: string): Promise<any> {
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
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }
}
