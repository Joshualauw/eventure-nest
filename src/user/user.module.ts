import { UserUniquePipe } from "./pipes/UserUniquePipe";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/_utils/service/prisma.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { Constant } from "src/_utils/constants";
import { JwtStrategy } from "src/_utils/guard/jwt.strategy";

@Module({
  controllers: [UserController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Constant.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [UserService, PrismaService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
