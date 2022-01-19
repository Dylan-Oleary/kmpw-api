import { ExtendedPrimitiveType } from "@theonlydevsever/utilities";

export interface IServiceField {
    /**
     * The name of the field
     */
    name: string;
    /**
     * Whether or not the field can be used when creating a new record
     */
    canCreate: boolean;
    /**
     * Whether or not the field can be usded when editing an existing record
     */
    canEdit: boolean;
    /**
     * Whether or not the field is required on create
     */
    isRequiredOnCreate: boolean;
    /**
     * Whether or not the fields is selectable
     */
    isSelectable: boolean;
    /**
     * The field type
     */
    type: ExtendedPrimitiveType;
    /**
     * Function that runs a set of custom validators against the passed value
     */
    validation?: (value: ExtendedPrimitiveType) => Promise<void>;
}
