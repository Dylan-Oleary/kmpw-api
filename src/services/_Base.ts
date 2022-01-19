import { IServiceField } from "types";

abstract class BaseService {
    private serviceFieldDefaults = {
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
}

export default BaseService;
export { BaseService };
