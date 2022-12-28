import * as Joi from "joi";

export interface CreateItinenaryDto {
  day: string;
}

export const createItinenarySchema = Joi.object<CreateItinenaryDto>({
  day: Joi.string().required(),
});
