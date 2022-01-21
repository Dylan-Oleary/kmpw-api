import { WeightClass } from "@prisma/client";

export interface ISafetyLevelSetBreedData {
    id: string;
    weightImperial?: number;
}

export type SafetyLevelDog = {
    id: string;
    coldSafetyLevelOneFarenheitTemp: number;
    coldSafetyLevelTwoFarenheitTemp: number;
    coldSafetyLevelThreeFarenheitTemp: number;
    coldSafetyLevelFourFarenheitTemp: number;
    coldSafetyLevelFiveFarenheitTemp: number;
    weightClass: WeightClass;
    weightImperial: number;
};

export type SafetyLevelDogSizeWhere =
    | { weightClass: { equals: WeightClass } }
    | { weightImperialMin: { lte: number }; weightImperialMax: { gte: number } };

export enum SafetyLevelModel {
    BREED = "Breed",
    DOG = "Dog"
}
