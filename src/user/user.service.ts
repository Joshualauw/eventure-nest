import * as bcrypt from "bcrypt";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import { exclude } from "src/_utils/helpers";
import { PrismaService } from "src/_utils/service/prisma.service";
import { CreateUserDto } from "./dto/CreateUserDto";
import { JwtService } from "@nestjs/jwt";
import { ApiStatus } from "src/_utils/constants";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getAllUsers(): Promise<Omit<User, "password">[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users.map((u) => exclude(u, ["password"]));
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async getOneUser(id: string): Promise<Omit<User, "password">> {
    try {
      const user = await this.prisma.user.findFirst({ where: { id } });
      return exclude(user, ["password"]);
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException(ApiStatus.GET_FAILED);
    }
  }

  async checkUniqueUser(payload: CreateUserDto): Promise<string[]> {
    const errors = [];

    const checkUserByEmail = await this.prisma.user.findFirst({ where: { email: payload.email } });
    if (checkUserByEmail) errors.push("email already taken");

    const checkUserByUsername = await this.prisma.user.findFirst({ where: { username: payload.username } });
    if (checkUserByUsername) errors.push("username already taken");

    const checkUserByPhone = await this.prisma.user.findFirst({ where: { phone: payload.phone } });
    if (checkUserByPhone) errors.push("phone number already taken");

    return errors;
  }

  async createUser(payload: Omit<CreateUserDto, "password_confirmation">): Promise<Omit<User, "password">> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = bcrypt.hashSync(payload.password, salt);
      const newUser = await this.prisma.user.create({ data: { ...payload, password: hashed } });
      return exclude(newUser, ["password"]);
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException("register failed");
    }
  }

  async validateUser(email: string, password: string): Promise<{ user: Omit<User, "password">; token: string }> {
    try {
      const user = await this.prisma.user.findFirst({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const userData = exclude(user, ["password"]);
        const token = this.jwtService.sign(userData);
        return { user: userData, token };
      }
      return null;
    } catch (e: any) {
      console.log(e);
      throw new InternalServerErrorException("validate user failed");
    }
  }
}
