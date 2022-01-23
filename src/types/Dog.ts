export interface ICreateDogData {
    /**
     * The name of the dog
     */
    name: string;
    /**
     * The dog's weight in lbs
     */
    weightImperial: number;
    /**
     * The breed id attached to the dog
     */
    breedId: string;
    /**
     * The id of the user that owns the dog
     */
    userId: string;
    /**
     * A short description about the dog
     */
    description?: string;
    /**
     * The dog's date of birth
     */
    birthday?: Date;
    /**
     * A link to an image of the dog
     */
    profilePicture?: string;
    /**
     * The height of the dog in inches
     */
    heightImperial?: number;
}

export interface IUpdateDogData {
    /**
     * The name of the dog
     */
    name?: string;
    /**
     * The dog's weight in lbs
     */
    weightImperial?: number;
    /**
     * The breed id attached to the dog
     */
    breedId?: string;
    /**
     * A short description about the dog
     */
    description?: string;
    /**
     * The dog's date of birth
     */
    birthday?: Date;
    /**
     * A link to an image of the dog
     */
    profilePicture?: string;
    /**
     * The height of the dog in inches
     */
    heightImperial?: number;
}

export interface IDogIdentifier {
    /**
     * The id of the dog to delete
     */
    id: string;
    /**
     * The id of the user who owns the dog
     */
    userId: string;
}
