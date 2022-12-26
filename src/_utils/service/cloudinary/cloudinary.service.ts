import { Injectable } from "@nestjs/common";
import { v2 } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {}

  async singleUpload(image_path: string, folder: string, filename: string) {
    const result = await v2.uploader.upload(image_path, {
      public_id: filename,
      folder,
    });
    return result.url;
  }

  async deleteFile(filename: string) {
    const result = await v2.uploader.destroy(filename);
    return result;
  }
}
