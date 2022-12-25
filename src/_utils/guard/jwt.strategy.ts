import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Constant } from "src/_utils/constants";
import { User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constant.JWT_SECRET,
    });
  }

  //if jwt extraction success, attach request object with user payload
  async validate(payload: Omit<User, "password">): Promise<Omit<User, "password">> {
    return payload;
  }
}
