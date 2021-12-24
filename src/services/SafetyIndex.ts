import { WeightClass } from "@prisma/client";
import { isValueOfType } from "@theonlydevsever/utilities";

import { NotFoundError, ValidationError } from "errors";
import { prismaClient } from "lib";

type SafetyIndexDog = {
    id: string;
    dangerColdRiskFarenheitTemp: number;
    levelOneDegreeRangeSize: number;
    levelTwoDegreeRangeSize: number;
    levelThreeDegreeRangeSize: number;
    noColdRiskFarenheitTemp: number;
    weightClass: WeightClass;
    weightImperial: number;
};

class SafetyIndexService {
    private _safetyIndex = 1;
    private _temperatureFarenheit: number;
    private _dog: SafetyIndexDog;

    constructor() {}

    public get dog(): SafetyIndexDog {
        return this._dog;
    }

    public setDog(data: { id: string; model: "Breed"; weightImperial?: number }): Promise<this> {
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

        if (model.toLowerCase() === "breed") {
            return Promise.all([
                prismaClient.breed.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        size: isValueOfType(weightImperial, "number")
                            ? false
                            : {
                                  select: {
                                      weightClass: true,
                                      levelOneDegreeRangeSize: true,
                                      levelTwoDegreeRangeSize: true,
                                      levelThreeDegreeRangeSize: true,
                                      noColdRiskFarenheitTemp: true,
                                      dangerColdRiskFarenheitTemp: true
                                  }
                              },
                        weightImperialAvg: true
                    }
                }),
                isValueOfType(weightImperial, "number")
                    ? prismaClient.dogSize.findFirst({
                          where:
                              weightImperial > 99
                                  ? { weightClass: { equals: WeightClass.LARGE } }
                                  : {
                                        weightImperialMax: {
                                            gte: weightImperial
                                        },
                                        weightImperialMin: {
                                            lte: weightImperial
                                        }
                                    },
                          select: {
                              weightClass: true,
                              levelOneDegreeRangeSize: true,
                              levelTwoDegreeRangeSize: true,
                              levelThreeDegreeRangeSize: true,
                              noColdRiskFarenheitTemp: true,
                              dangerColdRiskFarenheitTemp: true
                          }
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
        } else {
            return Promise.reject(new ValidationError("Invalid model passed"));
        }
    }

    public get temperatureFarenheit(): number {
        return this._temperatureFarenheit;
    }

    public setTemperature(temp: number): this {
        if (!isValueOfType(temp, "number")) {
            throw new ValidationError("Temperature must be a number");
        }

        this._temperatureFarenheit = temp < -100 ? -100 : temp;

        return this;
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
