import { WeightClass } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";

import { NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";
import { ISafetyIndexSetDogData, SafetyIndexDog, SafetyIndexDogSizeWhere } from "types";

/**
 * A service used to determine whether or not it is safe for a dog to go outside for a walk.
 */
class SafetyIndexService {
    private _safetyIndex = 1;
    private _temperatureFarenheit: number;
    private _dog: SafetyIndexDog;
    private readonly _prismaSizeSelectConfig = {
        weightClass: true,
        levelOneDegreeRangeSize: true,
        levelTwoDegreeRangeSize: true,
        levelThreeDegreeRangeSize: true,
        noColdRiskFarenheitTemp: true,
        dangerColdRiskFarenheitTemp: true
    };

    constructor() {}

    /**
     * Builds a valid `where` clause when querying for dog sizes based on the passed weight
     *
     * @param weightImperial The weight of the dog in lbs
     * @returns A `where` clause that is formatted for Prisma
     */
    private buildDogSizeWhere(weightImperial: number): SafetyIndexDogSizeWhere {
        return weightImperial > 99
            ? { weightClass: { equals: WeightClass.LARGE } }
            : {
                  weightImperialMax: {
                      gte: weightImperial
                  },
                  weightImperialMin: {
                      lte: weightImperial
                  }
              };
    }

    /**
     * Sets the dog information to be used when calculating the safety index.
     *
     * This information includes weight, breed, & safe temperature ranges
     *
     * @param data Data used to find and set the correct values needed when calculating the safety index
     * @returns The instantiated service
     */
    public setDog(data: ISafetyIndexSetDogData): Promise<this> {
        if (!isValueOfType(data, "object")) {
            return Promise.reject(new ValidationError("Dog data must be an object"));
        }

        const { id, model = "", weightImperial } = data;

        if (!isValueOfType(id, "string")) {
            return Promise.reject(new ValidationError("Dog ID must be a string"));
        }
        if (isValueOfType(weightImperial, "number") && weightImperial < 0) {
            return Promise.reject(new ValidationError("Weight cannot be less than 0"));
        }
        if (model?.toLowerCase() !== "breed") {
            return Promise.reject(new ValidationError("Invalid model passed"));
        }

        return Promise.all([
            prismaClient.breed.findUnique({
                where: { id },
                select: {
                    id: true,
                    size: isValueOfType(weightImperial, "number")
                        ? false
                        : { select: this._prismaSizeSelectConfig },
                    weightImperialAvg: true
                }
            }),
            isValueOfType(weightImperial, "number")
                ? prismaClient.dogSize.findFirst({
                      where: this.buildDogSizeWhere(weightImperial),
                      select: this._prismaSizeSelectConfig
                  })
                : Promise.resolve(null)
        ]).then(([breed, dogSize = null]) => {
            if (!breed) {
                return Promise.reject(
                    new NotFoundError(`Breed with id: ${id} could not be found.`)
                );
            }

            const { size, weightImperialAvg } = breed;
            const sizeToUse = dogSize || size;

            const {
                dangerColdRiskFarenheitTemp,
                levelOneDegreeRangeSize,
                levelThreeDegreeRangeSize,
                levelTwoDegreeRangeSize,
                noColdRiskFarenheitTemp,
                weightClass
            } = sizeToUse;
            const dog = {
                id,
                weightImperial: weightImperialAvg,
                dangerColdRiskFarenheitTemp,
                levelOneDegreeRangeSize,
                levelThreeDegreeRangeSize,
                levelTwoDegreeRangeSize,
                noColdRiskFarenheitTemp,
                weightClass
            };

            if (isValueOfType(weightImperial, "number")) {
                dog.weightImperial = weightImperial;
            }

            this._dog = dog;

            return this;
        });
    }

    /**
     * Sets the temperature to be used when calculating the safety index.
     *
     * @param temp The temperature in farenheit
     * @returns The instantiated service
     */
    public setTemperature(temp: number): this {
        if (!isValueOfType(temp, "number")) {
            throw new ValidationError("Temperature must be a number");
        }

        this._temperatureFarenheit = temp < -100 ? -100 : temp;

        return this;
    }

    public get temperatureFarenheit(): number {
        return this._temperatureFarenheit;
    }

    public get safetyIndex(): number {
        return this._safetyIndex;
    }

    private set safetyIndex(newIndex: number) {
        if (!isValueOfType(newIndex, "number")) {
            throw new ValidationError("Safety index must be a number");
        }

        this._safetyIndex = newIndex >= 0 ? Math.floor(newIndex) : 0;
    }
}

export default SafetyIndexService;
export { SafetyIndexService };
