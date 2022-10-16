import { UploadApiResponse, v2 } from "cloudinary";

import { DefinedErrorCodes, ServerError } from "errors";
import { prismaClient } from "lib";

interface IUploadImageOptions {
    path: string;
    userId: string;
}

class CloudinaryService {
    private cloudinary = v2;
    private cloudName: string;
    private folderPreFix: string;

    constructor() {
        this.cloudName = process?.env?.CLOUDINARY_CLOUD_NAME || "";
        this.folderPreFix = process?.env?.CLOUDINARY_FOLDER_PREFIX || "";
        this.cloudinary.config({
            api_key: process?.env?.CLOUDINARY_API_KEY || "",
            api_secret: process?.env?.CLOUDINARY_API_SECRET || "",
            cloud_name: this.cloudName,
            secure: true
        });
    }

    /**
     * Builds a folder path used to tell Cloudinary where to save the image
     *
     * @param userId The user id used to build the folder path
     * @returns A folder path used when saving the image
     */
    public buildUploadFolderPath(userId: string): string {
        return `${this.folderPreFix}/${process?.env?.NODE_ENV}/${userId}`;
    }

    /**
     * Deletes all images associated with a user in Cloudinary
     *
     * @param userId A user id
     */
    public async deleteUserImages(userId: string): Promise<void> {
        try {
            const folder = this.buildUploadFolderPath(userId);

            const userImageCount = await prismaClient.dog.count({
                where: { userId, profilePicture: { not: null } }
            });

            if (userImageCount > 0) {
                await this.cloudinary.api.delete_resources_by_prefix(`${folder}/`);
                await this.cloudinary.api.delete_folder(folder);
            }

            return;
        } catch (error) {
            throw new ServerError(
                DefinedErrorCodes.KMPW0018,
                error?.message ? [error?.message] : []
            ).setErrorCode("KMPW0018");
        }
    }

    /**
     * Uploads an image to Cloudinary
     *
     * @param opts Upload options
     * @returns The image data saved to Cloudinary
     */
    public uploadImage(opts: IUploadImageOptions): Promise<UploadApiResponse> {
        const { path, userId } = opts;

        return this.cloudinary.uploader.upload(path, {
            folder: this.buildUploadFolderPath(userId)
        });
    }
}

export default CloudinaryService;
export { CloudinaryService };
