import * as Sentry from "@sentry/node";
import { Request } from "express";
import { unlink } from "fs";
import { FileFilterCallback } from "multer";

import { DefinedErrorCodes, ServerError, ValidationError } from "errors";

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
                Sentry.captureException(
                    new ServerError(error?.message || "Asset failed to unlink").setErrorCode(
                        "KMPW0021"
                    ),
                    (scope) => {
                        scope.setLevel("fatal");

                        return scope;
                    }
                );
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
