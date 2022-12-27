import * as Joi from "joi";

export interface LoginDto {
  email: string;
  password: string;
}

export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(15),
});
