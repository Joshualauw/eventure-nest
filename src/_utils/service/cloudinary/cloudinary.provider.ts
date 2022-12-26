import { v2 } from "cloudinary";
import { Constant } from "src/_utils/constants";

export const CloudinaryProvider = {
  provide: Constant.CLOUDINARY,
  useFactory: (): any => {
    return v2.config({
      cloud_name: Constant.CLOUDINARY_CLOUD_NAME,
      api_key: Constant.CLOUDINARY_API_KEY,
      api_secret: Constant.CLOUDINARY_API_SECRET,
    });
  },
};
