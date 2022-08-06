import { NextFunction, Request, RequestHandler, Response } from "express";
import { MulterError } from "multer";

import { DefinedErrorCodes, ServerError, ValidationError } from "errors";
import BaseError from "errors/BaseError";

/**
 * Validates the assets to be uploaded
 *
 * @param upload The Multer request handler
 * @param multiple Whether or not multiple assets are being processed in the request
 */
const validateAssetUpload: (
    upload: RequestHandler,
    multiple?: boolean
) => (req: Request, res: Response, next: NextFunction) => void =
    (upload, multiple = false) =>
    (req, res, next) => {
        upload(req, res, (error) => {
            if (error instanceof MulterError) {
                return next(
                    new ServerError(DefinedErrorCodes.KMPW0017, [
                        error?.message || "An error occurred while processing the asset upload"
                    ]).setErrorCode("KMPW0017")
                );
            } else if (error) {
                return next(
                    error instanceof BaseError
                        ? error
                        : new ServerError(DefinedErrorCodes.KMPW0017, [
                              error?.message ||
                                  "An unknown error occurred while attempting to process the asset"
                          ]).setErrorCode("KMPW0017")
                );
            }

            const isMissingImageData = multiple
                ? !req?.files || req?.files?.length === 0
                : !req?.file;

            if (isMissingImageData) {
                return next(
                    new ValidationError(DefinedErrorCodes.KMPW0016, [
                        "No image found in the request"
                    ]).setErrorCode("KMPW0016")
                );
            }

            return next();
        });
    };

export default validateAssetUpload;
export { validateAssetUpload };
