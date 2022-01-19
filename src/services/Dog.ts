import { DefinedErrorCodes, NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";
import { BaseService, UserService } from "services";
import { IServiceField } from "types";

class DogService extends BaseService {
    readonly modelFields: IServiceField[] = [
        ...this.baseModelFields,
        this.generateServiceField({
            name: "name",
            type: "string",
            validation: async (value) => {
                if (value?.trim()?.length === 0)
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, ["Name cannot be empty"]);
                if (value?.trim().length > 50)
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        "Name cannot be more than 50 characters"
                    ]);
            }
        }),
        this.generateServiceField({
            name: "description",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (value?.trim().length > 250)
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        "Description cannot be more than 250 characters"
                    ]);
            }
        }),
        this.generateServiceField({
            name: "birthday",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (isNaN(Date.parse(value))) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        `${value} is not a valid date`
                    ]);
                }
            }
        }),
        this.generateServiceField({
            name: "profilePicture",
            isRequiredOnCreate: false,
            type: "string",
            validation: async (value) => {
                if (value?.trim().length > 250) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        "Profile picture cannot be more than 250 characters"
                    ]);
                }
            }
        }),
        this.generateServiceField({
            name: "heightImperial",
            isRequiredOnCreate: false,
            type: "number",
            validation: async (value) => {
                if (Number(value) === 0) {
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        "Height must be greater than 0"
                    ]);
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
                    throw new ValidationError(DefinedErrorCodes.KMPW0009, [
                        "Weight must be greater than 0"
                    ]);
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

                    throw new NotFoundError("Breed not found", [`Breed not found using id: ${id}`]);
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
            type: "string",
            validation: async (id) => {
                await new UserService().getUser({ id }).catch((error) => {
                    throw error;
                });
            }
        })
    ];

    constructor() {
        super();
    }

    createDog(data) {
        console.info(this.getPrismaSelectConfig(), data);
        return;
    }
}

export default DogService;
export { DogService };
