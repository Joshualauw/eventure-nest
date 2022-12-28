import * as Joi from "joi";

export interface CreateActivityDto {
  name: string;
  start_time: string;
  end_time: string;
}

export const createActivitySchema = Joi.object<CreateActivityDto>({
  name: Joi.string().required(),
  start_time: Joi.string().required().label("start time"),
  end_time: Joi.string().required().label("end time"),
});
