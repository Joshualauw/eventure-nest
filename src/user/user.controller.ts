import { CreateUserDto, createUserSchema } from "./dto/CreateUserDto";
import { Controller, Get, HttpStatus, UsePipes, Post, HttpCode } from "@nestjs/common";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { UserService } from "./user.service";
import { Body, Param } from "@nestjs/common/decorators";
import { LoginDto, loginSchema } from "./dto/LoginDto";
import { ApiStatus } from "src/_utils/constants";
import { UserUniquePipe } from "./pipes/UserUniquePipe";
import { exclude } from "src/_utils/helpers";
import { ObjectIdPipe } from "src/_utils/pipes/ObjectIdPipe";
import { Public } from "src/_utils/decorator/public.decorator";
import { UserReq } from "src/_utils/decorator/user.decorator";
import { User } from "@prisma/client";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Public()
  async findAll(): Promise<ApiResponse> {
    const users = await this.userService.getAllUsers();
    return {
      data: users,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get("auth")
  async getLoggedUser(@UserReq() user: User): Promise<ApiResponse> {
    return {
      data: user,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post("login")
  @Public()
  @UsePipes(new ValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    const loginData = await this.userService.validateUser(loginDto.email, loginDto.password);
    return {
      data: loginData,
      code: HttpStatus.OK,
      message: "login successful",
    };
  }

  @Post("register")
  @Public()
  @HttpCode(201)
  @UsePipes(new ValidationPipe(createUserSchema), UserUniquePipe)
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    const newUser = await this.userService.createUser(exclude(createUserDto, ["password_confirmation"]));
    return {
      data: newUser,
      code: HttpStatus.CREATED,
      message: "register successful",
    };
  }

  @Get(":id")
  @Public()
  async findOne(@Param("id", ObjectIdPipe) id: string): Promise<ApiResponse> {
    const users = await this.userService.getOneUser(id);
    return {
      data: users,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }
}
