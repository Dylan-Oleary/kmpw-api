import { Request } from "express";
import { unlink } from "fs";
import { FileFilterCallback } from "multer";

import { DefinedErrorCodes, ValidationError } from "errors";

/**
 * Removes an image from the file system
 *
 * @param imagePath The path to the image in the file system
 */
export const removeImageFromLocalEnvironment: (imagePath: string) => Promise<void> = (
    imagePath = ""
) =>
    new Promise((resolve) =>
        unlink(imagePath, (error) => {
            if (error) {
                // TODO: Log this to monitoring
                console.error("Unable to delete uploaded image");
            }

            resolve();
        })
    );

export const validateMimeType: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
    validMimeTypes: string[]
) => void = (req, file, callback, validMimeTypes = []) => {
    if (validMimeTypes.indexOf(file?.mimetype) === -1) {
        return callback(
            new ValidationError(DefinedErrorCodes.KMPW0016, [
                `Invalid asset mime type: Expected one of ${validMimeTypes.join(
                    ", "
                )} but received ${file.mimetype}`
            ]).setErrorCode("KMPW0016")
        );
    }

    return callback(null, true);
};
