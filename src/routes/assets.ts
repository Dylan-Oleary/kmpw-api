import { NextFunction, Request, Response, Router } from "express";
import fs from "fs";
import multer from "multer";

import { NotAllowedError } from "errors";
import { validateMimeType } from "lib";
import { validateAssetUpload } from "middlewares";
import { CloudinaryService } from "services";

const assetsRouter: Router = Router({ caseSensitive: true });
const fileUpload = multer({
    dest: "uploads/",
    fileFilter: (req, file, callback) =>
        validateMimeType(req, file, callback, ["image/png", "image/jpeg"]),
    limits: {
        files: 1,
        fileSize: 10000000 // 10MB,
    }
});

assetsRouter
    .route("/uploads/dogs")
    .post(
        validateAssetUpload(fileUpload.single("image")),
        (req: Request, res: Response, next: NextFunction) => {
            const { path } = req?.file;
            const { tokenClaims } = res?.locals;

            return new CloudinaryService()
                .uploadImage({ path, userId: tokenClaims?.sub })
                .then(({ secure_url }) => {
                    return fs.unlink(path, (error) => {
                        if (error) {
                            // TODO: Log this to monitoring
                            console.error("Unable to delete uploaded image");
                        }

                        return res.status(201).json({ secure_url });
                    });
                })
                .catch(next);
        }
    )
    .get((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .patch((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .put((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()))
    .delete((req: Request, res: Response, next: NextFunction) => next(new NotAllowedError()));

export default assetsRouter;
export { assetsRouter };
