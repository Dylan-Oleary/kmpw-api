import { DefinedErrorCodes, NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";
import { ModelService } from "services";
import { IServiceField } from "types";

class DogService extends ModelService {
    readonly modelFields: IServiceField[] = [
        ...this.baseModelFields,
        this.generateServiceField({
            name: "name",
            type: "string",
            validation: async (value) => {
                if (value?.trim()?.length === 0)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Name cannot be empty"
                    ]).setErrorCode("KMPW0015");
                if (value?.trim().length > 50)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Name cannot be more than 50 characters"
                    ]).setErrorCode("KMPW0015");
            }
        }),
        this.generateServiceField({
            name: "description",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (value?.trim().length > 250)
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Description cannot be more than 250 characters"
                    ]).setErrorCode("KMPW0015");
            }
        }),
        this.generateServiceField({
            name: "birthday",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (isNaN(Date.parse(value))) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        `${value} is not a valid date`
                    ]).setErrorCode("KMPW0015");
                }
            }
        }),
        this.generateServiceField({
            name: "profilePicture",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (value?.trim().length > 250) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Profile picture cannot be more than 250 characters"
                    ]).setErrorCode("KMPW0015");
                }
            }
        }),
        this.generateServiceField({
            name: "heightImperial",
            isRequiredOnCreate: false,
            type: "number",
            validation: async (value) => {
                if (Number(value) === 0) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Height must be greater than 0"
                    ]).setErrorCode("KMPW0015");
                }
            }
        }),
        this.generateServiceField({
            name: "heightMetric",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "number"
        }),
        this.generateServiceField({
            name: "weightImperial",
            type: "number",
            validation: async (value) => {
                if (Number(value) === 0) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0015, [
                        "Weight must be greater than 0"
                    ]).setErrorCode("KMPW0015");
                }
            }
        }),
        this.generateServiceField({
            name: "weightMetric",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "number"
        }),
        this.generateServiceField({
            name: "breedId",
            type: "string",
            validation: async (id) => {
                await prismaClient.breed.findUnique({ where: { id } }).catch((error) => {
                    console.error(error);

                    throw new NotFoundError("Breed not found", [
                        `Breed not found using id: ${id}`
                    ]).setErrorCode("KMPW0015");
                });
            }
        }),
        this.generateServiceField({
            name: "sizeId",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "string"
        }),
        this.generateServiceField({
            name: "userId",
            canEdit: false,
            type: "string"
        })
    ];

    constructor() {
        super();
    }

    public createDog(data) {
        console.info(this.getPrismaSelectConfig(), data);
        return;
    }
}

export default DogService;
export { DogService };
