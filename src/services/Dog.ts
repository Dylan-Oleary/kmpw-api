import { Dog } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";
import convert from "convert-units";

import { BadRequestError, DefinedErrorCodes, NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";
import { ModelService } from "services";
import { ICreateDogData, IDeleteDogData, IServiceField } from "types";

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
                await prismaClient.breed
                    .findUnique({ where: { id } })
                    .then((breed) => {
                        if (!breed) {
                            throw new NotFoundError("Breed not found", [
                                `Breed not found using id: ${id}`
                            ]).setErrorCode("KMPW0015");
                        }
                    })
                    .catch((error) => {
                        throw error;
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

    /**
     * Creates a new dog record based on the passed data
     *
     * @param data Data used to create a dog record
     * @returns A dog record
     */
    public async createDog(data: ICreateDogData): Promise<Dog> {
        try {
            const validatedData = await super.validateCreateData<ICreateDogData>(data);
            const sizeId = await this.getDogSizeFromWeight(validatedData.weightImperial);
            const createData: ICreateDogData & {
                heightMetric?: number;
                sizeId: string;
                weightMetric: number;
            } = {
                ...validatedData,
                sizeId,
                weightMetric: Number(
                    convert(validatedData.weightImperial).from("lb").to("kg").toFixed(1)
                )
            };
            const { heightImperial } = createData;

            if (isValueOfType(heightImperial, "number")) {
                createData.heightMetric = Number(
                    convert(heightImperial).from("in").to("cm").toFixed(1)
                );
            }

            return prismaClient.dog.create({ data: createData });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes a dog record
     *
     * @param id The id of the dog to delete
     * @param user The user that owns the dog
     * @returns The deleted dog record
     */
    public deleteDog(data: IDeleteDogData): Promise<Dog> {
        if (!isValueOfType(data?.id, "string")) {
            return Promise.reject(
                new BadRequestError("Invalid data", [
                    `Expected id to be of type string, but received ${typeof data?.id}`
                ])
            );
        }

        if (!isValueOfType(data?.userId, "string")) {
            return Promise.reject(
                new BadRequestError("Invalid data", [
                    `Expected userId to be of type string, but received ${typeof data?.userId}`
                ])
            );
        }

        return prismaClient.dog.findFirst({ where: data }).then((dog) => {
            if (!dog) {
                return Promise.reject(new NotFoundError("Dog not found"));
            }

            return prismaClient.dog.update({ data: { isDeleted: true }, where: { id: dog.id } });
        });
    }

    /**
     * Returns the size id based on the passed weight and sizes
     *
     * @param weight The weight (in lbs) used to determine the correct size
     * @returns A size record id
     */
    private getDogSizeFromWeight(weight: number): Promise<string> {
        return prismaClient.dogSize.findMany().then((sizes) => {
            if (!isValueOfType(sizes, "array") || sizes?.length === 0) {
                return Promise.reject(new NotFoundError("Sizes not found"));
            }

            const { id } =
                weight >= 99
                    ? sizes.find(({ weightClass }) => weightClass === "LARGE")
                    : sizes.find(
                          ({ weightImperialMin, weightImperialMax }) =>
                              weight >= weightImperialMin && weight < weightImperialMax
                      );

            return id;
        });
    }
}

export default DogService;
export { DogService };
