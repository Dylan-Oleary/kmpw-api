import { UploadApiResponse, v2 } from "cloudinary";

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
