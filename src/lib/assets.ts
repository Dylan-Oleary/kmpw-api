import { Request } from "express";
import { FileFilterCallback } from "multer";

import { DefinedErrorCodes, ValidationError } from "errors";

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
