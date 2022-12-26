export const Constant = {
  PUBLIC_DECORATOR: "isPublic",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  CLOUDINARY: "Cloudinary",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "joshualauw",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",
};

export enum ApiStatus {
  CREATE_FAILED = "failed to create",
  CREATE_SUCCESS = "created successfully",
  GET_FAILED = "failed to fetch",
  GET_SUCCESS = "fetch successfully",
  UPDATE_FAILED = "failed to update",
  UPDATE_SUCCESS = "updated successfully",
  DELETE_FAILED = "failed to delete",
  DELETE_SUCCESS = "deleted successfully",
  VALIDATION_FAILED = "validation error",
}
