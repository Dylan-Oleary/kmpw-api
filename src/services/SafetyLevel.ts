import { Dog, DogSize, SafetyLevel, WeightClass } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";

import { NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";
import {
    ISafetyLevelSetBreedData,
    SafetyLevelDog,
    SafetyLevelDogSizeWhere,
    SafetyLevelModel
} from "types";

/**
 * A service used to determine whether or not it is safe for a dog to go outside for a walk.
 */
class SafetyLevelService {
    private _safetyLevel = 1;
    private _temperatureFarenheit: number;
    private _dog: SafetyLevelDog;
    private readonly _prismaSizeSelectConfig = {
        weightClass: true,
        coldSafetyLevelOneFarenheitTemp: true,
        coldSafetyLevelTwoFarenheitTemp: true,
        coldSafetyLevelThreeFarenheitTemp: true,
        coldSafetyLevelFourFarenheitTemp: true,
        coldSafetyLevelFiveFarenheitTemp: true
    };

    constructor() {}

    /**
     * Builds a valid `where` clause when querying for dog sizes based on the passed weight
     *
     * @param weightImperial The weight of the dog in lbs
     * @returns A `where` clause that is formatted for Prisma
     */
    private buildDogSizeWhere(weightImperial: number): SafetyLevelDogSizeWhere {
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
     * Calculates the current safety level based on the set temperature and safety level
     * ranges of the dog or breed
     *
     * @returns The instantiated service
     */
    public calculateSafetyLevel(): this {
        if (this._temperatureFarenheit < 0) {
            this.setSafetyLevel(5);

            return this;
        }

        if (this._temperatureFarenheit >= 68) {
            this.setSafetyLevel(3);

            return this;
        }

        const temperatures = Object.keys(this._dog)
            .filter((key) => key.includes("coldSafetyLevel"))
            .map((key) => this._dog[key])
            .sort((a, b) => b - a);

        for (let i = temperatures.length - 1; i >= 0; i--) {
            if (i === temperatures.length - 1 && this._temperatureFarenheit < temperatures[i - 1]) {
                this.setSafetyLevel(i + 1);

                break;
            } else if (
                this._temperatureFarenheit >= temperatures[i] &&
                this._temperatureFarenheit < temperatures[i - 1]
            ) {
                this.setSafetyLevel(i + 1);

                break;
            }
        }

        return this;
    }

    /**
     * Finds the safety level record in the database based on the currently set level
     *
     * @returns A `SafetyLevel` record from the database
     */
    public getSafetyLevel(): Promise<SafetyLevel> {
        return prismaClient.safetyLevel.findUnique({ where: { level: this._safetyLevel } });
    }

    /**
     * Sets the breed or dog values used for calculating the safety level
     *
     * @param data The data used to set correct dog values
     * @param model The model used to make size determinations against
     * @returns The instantiated service
     */
    public setDog(
        data: Dog | ISafetyLevelSetBreedData,
        model: SafetyLevelModel = SafetyLevelModel.DOG
    ): Promise<this> {
        if (!isValueOfType(data, "object")) {
            return Promise.reject(new ValidationError(`${model} data must be an object`));
        }

        const { id, weightImperial } = data;

        if (!isValueOfType(id, "string")) {
            return Promise.reject(new ValidationError(`${model} ID must be a string`));
        }
        if (isValueOfType(weightImperial, "number") && weightImperial < 0) {
            return Promise.reject(new ValidationError("Weight cannot be less than 0"));
        }

        if (model === SafetyLevelModel.DOG) {
            const { id, sizeId, weightImperial } = data as Dog;

            return prismaClient.dogSize
                .findUnique({ where: { id: sizeId }, select: this._prismaSizeSelectConfig })
                .then((size) => {
                    if (!size) {
                        return Promise.reject(
                            new NotFoundError("Dog size not found", [
                                `Size not found using id: ${sizeId}`
                            ])
                        );
                    }

                    const {
                        coldSafetyLevelOneFarenheitTemp,
                        coldSafetyLevelTwoFarenheitTemp,
                        coldSafetyLevelThreeFarenheitTemp,
                        coldSafetyLevelFourFarenheitTemp,
                        coldSafetyLevelFiveFarenheitTemp,
                        weightClass
                    } = size;
                    const dog = {
                        id,
                        weightImperial,
                        coldSafetyLevelOneFarenheitTemp,
                        coldSafetyLevelTwoFarenheitTemp,
                        coldSafetyLevelThreeFarenheitTemp,
                        coldSafetyLevelFourFarenheitTemp,
                        coldSafetyLevelFiveFarenheitTemp,
                        weightClass
                    };

                    this._dog = dog;

                    return this;
                });
        } else if (model === SafetyLevelModel.BREED) {
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
                const sizeToUse: DogSize = dogSize || size;

                const {
                    coldSafetyLevelOneFarenheitTemp,
                    coldSafetyLevelTwoFarenheitTemp,
                    coldSafetyLevelThreeFarenheitTemp,
                    coldSafetyLevelFourFarenheitTemp,
                    coldSafetyLevelFiveFarenheitTemp,
                    weightClass
                } = sizeToUse;
                const dog = {
                    id,
                    weightImperial: weightImperialAvg,
                    coldSafetyLevelOneFarenheitTemp,
                    coldSafetyLevelTwoFarenheitTemp,
                    coldSafetyLevelThreeFarenheitTemp,
                    coldSafetyLevelFourFarenheitTemp,
                    coldSafetyLevelFiveFarenheitTemp,
                    weightClass
                };

                if (isValueOfType(weightImperial, "number")) {
                    dog.weightImperial = weightImperial;
                }

                this._dog = dog;

                return this;
            });
        } else {
            return Promise.reject(
                new ValidationError("Invalid model", [
                    `Model must be one of ${Object.entries(SafetyLevelModel)
                        .map(([, v]) => `'${v}'`)
                        .join(", ")}`
                ])
            );
        }
    }

    /**
     * Sets a new safety level
     *
     * @param level The new safety level
     * @returns The instantiated service
     */
    public setSafetyLevel(level: number): this {
        if (!isValueOfType(level, "number")) {
            throw new ValidationError("Safety level must be a number");
        }

        this._safetyLevel = level >= 1 ? Math.floor(level) : 1;

        return this;
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
}

export default SafetyLevelService;
export { SafetyLevelService };
