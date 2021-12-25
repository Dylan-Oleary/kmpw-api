import { WeightClass } from "@prisma/client";

export interface ISafetyIndexSetDogData {
    id: string;
    model: "Breed";
    weightImperial?: number;
}

export type SafetyIndexDog = {
    id: string;
    coldSafetyLevelOneFarenheitTemp: number;
    coldSafetyLevelTwoFarenheitTemp: number;
    coldSafetyLevelThreeFarenheitTemp: number;
    coldSafetyLevelFourFarenheitTemp: number;
    coldSafetyLevelFiveFarenheitTemp: number;
    weightClass: WeightClass;
    weightImperial: number;
};

export type SafetyIndexDogSizeWhere =
    | { weightClass: { equals: WeightClass } }
    | { weightImperialMin: { lte: number }; weightImperialMax: { gte: number } };
