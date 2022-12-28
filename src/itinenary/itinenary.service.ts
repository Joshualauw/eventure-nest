import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "@nestjs/common/exceptions";
import { Activity, Itinenary } from "@prisma/client";
import { ApiStatus } from "src/_utils/constants";
import { PrismaService } from "src/_utils/service/prisma.service";
import { CreateActivityDto } from "./dto/CreateActivityDto";
import { CreateItinenaryDto } from "./dto/CreateItinenaryDto";
import * as mongoose from "mongoose";

@Injectable()
export class ItinenaryService {
  constructor(private prisma: PrismaService) {}

  async getEventItinenary(event_id: string): Promise<Itinenary[]> {
    try {
      const itinenaries = await this.prisma.itinenary.findMany({ where: { event_id } });
      return itinenaries;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async createItinenary(event_id: string, payload: CreateItinenaryDto): Promise<Itinenary> {
    try {
      const itinenary = await this.prisma.itinenary.create({ data: { event_id, ...payload } });
      return itinenary;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.CREATE_FAILED);
    }
  }

  async updateItinenary(id: string, payload: CreateItinenaryDto): Promise<Itinenary> {
    try {
      const itinenary = await this.prisma.itinenary.update({ where: { id }, data: payload });
      return itinenary;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.UPDATE_FAILED);
    }
  }

  async deleteItinenary(id: string): Promise<Itinenary> {
    try {
      const itinenary = await this.prisma.itinenary.delete({ where: { id } });
      return itinenary;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.DELETE_FAILED);
    }
  }

  async createActivity(id: string, payload: CreateActivityDto): Promise<Activity> {
    try {
      const itinenary = await this.prisma.itinenary.update({
        where: { id },
        data: { activity: { push: { id: new mongoose.Types.ObjectId().toString(), ...payload } } },
      });

      return itinenary.activity[itinenary.activity.length - 1];
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.CREATE_FAILED);
    }
  }

  async deleteActivity(id: string, activity_id: string): Promise<Itinenary> {
    try {
      const itinenary = await this.prisma.itinenary.findFirst({ where: { id } });
      if (itinenary) {
        itinenary.activity = itinenary.activity.filter((it) => it.id != activity_id);
        await this.prisma.itinenary.update({
          where: { id },
          data: { activity: { set: itinenary.activity } },
        });
        return itinenary;
      }
      return null;
    } catch (e: any) {
      throw new InternalServerErrorException(ApiStatus.DELETE_FAILED);
    }
  }
}
