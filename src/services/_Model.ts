import { ExtendedPrimitiveType, isValueOfType } from "@theonlydevsever/utilities";
import { DefinedErrorCodes, ValidationError } from "errors";
import { IServiceField } from "types";

/**
 * An abstract class used for administering custom data models in the system
 */
abstract class ModelService {
    private readonly serviceFieldDefaults = {
        canCreate: true,
        canEdit: true,
        isRequiredOnCreate: true,
        isSelectable: true
    };
    readonly baseModelFields: IServiceField[] = [
        this.generateServiceField({
            name: "id",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "string"
        }),
        this.generateServiceField({
            name: "createdAt",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "string"
        }),
        this.generateServiceField({
            name: "updatedAt",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "string"
        }),
        this.generateServiceField({
            name: "isDeleted",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "boolean"
        })
    ];
    readonly modelFields: IServiceField[];

    constructor() {}

    public generateServiceField(fieldOpts: Partial<IServiceField>): IServiceField {
        return { ...this.serviceFieldDefaults, ...fieldOpts } as IServiceField;
    }

    public getPrismaSelectConfig(): Record<string, boolean> {
        const config = {};

        for (const { name, isSelectable } of this.modelFields) {
            if (isSelectable) config[name] = true;
        }

        return config;
    }

    /**
     * Validates create data against the model field configuration
     *
     * @param data The data used to create a record
     * @returns The passed create data object
     */
    public async validateCreateData<T = Record<string, unknown>>(data: T): Promise<T> {
        const creatableFields = this.modelFields.filter(({ canCreate }) => canCreate);
        const requiredFields = this.modelFields.filter(
            ({ isRequiredOnCreate }) => isRequiredOnCreate
        );

        for (const { name } of requiredFields) {
            const value = data?.[name];

            if (
                isValueOfType(value, "null") ||
                isValueOfType(value, "undefined") ||
                (isValueOfType(value, "string") && (value as string)?.trim().length === 0)
            ) {
                return Promise.reject(
                    new ValidationError(DefinedErrorCodes.KMPW0015, [
                        `${name} is required on create`
                    ]).setErrorCode("KMPW0015")
                );
            }
        }

        for (const [key, value] of Object.entries(data)) {
            const fieldConfig = creatableFields.find(({ name }) => name === key);

            if (!fieldConfig) {
                return Promise.reject(
                    new ValidationError(DefinedErrorCodes.KMPW0015, [
                        `${key} is not allowed on create`
                    ]).setErrorCode("KMPW0015")
                );
            }

            const { type, validation } = fieldConfig;

            if (!isValueOfType(value, type)) {
                return Promise.reject(
                    new ValidationError(DefinedErrorCodes.KMPW0015, [
                        `Expected ${key} to be of type ${type}, but received ${typeof value}`
                    ]).setErrorCode("KMPW0015")
                );
            }

            if (isValueOfType(validation, "function")) {
                await fieldConfig
                    ?.validation(value as ExtendedPrimitiveType)
                    .catch((error) => Promise.reject(error));
            }
        }

        return data;
    }
}

export default ModelService;
export { ModelService };
