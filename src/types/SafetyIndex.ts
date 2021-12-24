import { WeightClass } from "@prisma/client";

export interface ISafetyIndexSetDogData {
    id: string;
    model: "Breed";
    weightImperial?: number;
}

export type SafetyIndexDog = {
    id: string;
    dangerColdRiskFarenheitTemp: number;
    levelOneDegreeRangeSize: number;
    levelTwoDegreeRangeSize: number;
    levelThreeDegreeRangeSize: number;
    noColdRiskFarenheitTemp: number;
    weightClass: WeightClass;
    weightImperial: number;
};

export type SafetyIndexDogSizeWhere =
    | { weightClass: { equals: WeightClass } }
    | { weightImperialMin: { lte: number }; weightImperialMax: { gte: number } };
