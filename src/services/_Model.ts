import { ExtendedPrimitiveType, isValueOfType } from "@theonlydevsever/utilities";
import { DefinedErrorCodes, ValidationError } from "errors";
import { IServiceField } from "types";

/**
 * An abstract class used for administering custom data models in the system
 */
abstract class ModelService<T = Record<string, unknown>> {
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
            type: "date"
        }),
        this.generateServiceField({
            name: "updatedAt",
            canCreate: false,
            canEdit: false,
            isRequiredOnCreate: false,
            type: "date"
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

    public getPrismaSelectConfig(): Record<keyof T, boolean> {
        const config = {};

        for (const { name, isSelectable } of this.modelFields) {
            if (isSelectable) config[name] = true;
        }

        return config as Record<keyof T, boolean>;
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
            await this.validateFieldData(creatableFields, { key, value }, "CREATE");
        }

        return data;
    }

    /**
     * Validates update data against the model field configuration
     *
     * @param data The data used to update a record
     * @returns The passed update data object
     */
    public async validateUpdateData<T = Record<string, unknown>>(data: T): Promise<T> {
        const editableFields = this.modelFields.filter(({ canEdit }) => canEdit);

        for (const [key, value] of Object.entries(data)) {
            await this.validateFieldData(editableFields, { key, value }, "EDIT");
        }

        return data;
    }

    /**
     * Validates passed data based on its field configuration
     *
     * @param fields A list of fields existing on the model
     * @param data The key/value pair of the passed data
     * @param operation The type of operation – Create or Update
     */
    public async validateFieldData(
        fields: IServiceField[],
        data: { key: string; value: unknown },
        operation: "CREATE" | "EDIT" = "CREATE"
    ): Promise<void> {
        const { key, value } = data;
        const fieldConfig = (fields || []).find(({ name }) => name === key);

        if (!fieldConfig) {
            return Promise.reject(
                new ValidationError(DefinedErrorCodes.KMPW0015, [
                    `${key} is not allowed on ${operation.toLowerCase()}`
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
}

export default ModelService;
export { ModelService };
