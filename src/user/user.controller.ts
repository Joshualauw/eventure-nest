import { CreateUserDto, createUserSchema } from "./dto/CreateUserDto";
import { Controller, Get, HttpStatus, UsePipes, Post, UseGuards, Request } from "@nestjs/common";
import { ValidationPipe } from "src/_utils/pipes/ValidationPipe";
import { ApiResponse } from "src/_utils/types/ApiResponse";
import { UserService } from "./user.service";
import { Body, Param } from "@nestjs/common/decorators";
import { LoginDto, loginSchema } from "./dto/LoginDto";
import { JwtAuthGuard } from "src/_utils/guard/jwt.guard";
import { ApiStatus } from "src/_utils/constants";
import { UserUniquePipe } from "./pipes/UserUniquePipe";
import { exclude } from "src/_utils/helpers";
import { ObjectIdPipe } from "src/_utils/pipes/ObjectIdPipe";

@Controller("api")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user")
  async findAll(): Promise<ApiResponse> {
    const users = await this.userService.getAllUsers();
    return {
      data: users,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get("user/:id")
  async findOne(@Param("id", ObjectIdPipe) id: string): Promise<ApiResponse> {
    const users = await this.userService.getOneUser(id);
    return {
      data: users,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Get("auth")
  @UseGuards(JwtAuthGuard)
  async getLoggedUser(@Request() req: any): Promise<ApiResponse> {
    return {
      data: req.user,
      code: HttpStatus.OK,
      message: ApiStatus.GET_SUCCESS,
    };
  }

  @Post("login")
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
  @UsePipes(new ValidationPipe(createUserSchema))
  async register(@Body(UserUniquePipe) createUserDto: CreateUserDto): Promise<ApiResponse> {
    const newUser = await this.userService.createNewUser(exclude(createUserDto, ["password_confirmation"]));
    return {
      data: newUser,
      code: HttpStatus.CREATED,
      message: "register successful",
    };
  }
}
