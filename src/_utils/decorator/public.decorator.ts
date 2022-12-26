import { SetMetadata } from "@nestjs/common";
import { Constant } from "../constants";

export const Public = () => SetMetadata(Constant.PUBLIC_DECORATOR, true);
