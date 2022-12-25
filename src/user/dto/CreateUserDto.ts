import * as Joi from "joi";

export interface CreateUserDto {
  username: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export const createUserSchema = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().required().email(),
  phone: Joi.string().required().min(9).max(12),
  password: Joi.string().required().min(6).max(15),
  password_confirmation: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "password doesn't match",
    })
    .label("password confirmation"),
});
