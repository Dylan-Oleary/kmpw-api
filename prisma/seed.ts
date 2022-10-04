import { BreedSource, DogAttributeType, DogSize } from "@prisma/client";

import { customBreeds, dogSizes, safetyLevels } from "./data";
import { prismaClient } from "../src/lib";
import { DogApiService } from "../src/services";
import { CustomBreed, IDogApiBreed } from "../src/types";

async function seed() {
    /**
     * Upsert Dog Sizes
     */
    const dogSizeRecords: DogSize[] = [];

    for (const size of dogSizes) {
        const dogSizeRecord = await prismaClient.dogSize.upsert({
            where: { weightClass: size.weightClass },
            update: size,
            create: size
        });

        dogSizeRecords.push(dogSizeRecord);
    }

    /**
     * Fetch & Upsert Breed Groups & Breeds
     */
    const dogApi = new DogApiService();
    const breeds = await dogApi.getBreeds();
    const allBreeds = [
        ...breeds.map((breed) => ({ ...breed, source: BreedSource.DOG_API })),
        ...customBreeds
    ];

    for (const breed of allBreeds) {
        const {
            bred_for = "",
            country_code: countryCode,
            description,
            id,
            name,
            origin,
            temperament = ""
        } = breed as CustomBreed | IDogApiBreed;
        const breedGroup = dogApi.getBreedGroupFromBreed(breed);

        const breedGroupRecord = await prismaClient.breedGroup.upsert({
            where: { name: breedGroup },
            update: {},
            create: { name: breedGroup }
        });

        const breedMeasurements = dogApi.formatBreedMeasurements(breed);
        const { weightImperialAvg } = breedMeasurements;
        const breedSize =
            weightImperialAvg >= 99
                ? dogSizeRecords.find(({ weightClass }) => weightClass === "LARGE")
                : dogSizeRecords.find(
                      ({ weightImperialMin, weightImperialMax }) =>
                          weightImperialAvg >= weightImperialMin &&
                          weightImperialAvg < weightImperialMax
                  );
        const breedUpsertData = {
            breedGroupId: breedGroupRecord.id,
            sizeId: breedSize.id,
            countryCode,
            description,
            dogApiId: id,
            name,
            origin,
            source: breed?.source,
            ...breedMeasurements
        };

        const breedRecord = await prismaClient.breed.upsert({
            where: { name },
            update: breedUpsertData,
            create: breedUpsertData
        });

        /**
         * Format & Add Attributes
         */
        const bredForData: string[] = bred_for.split(",").filter((v) => v?.trim()?.length > 0);
        const temperamentData: string[] = temperament
            .split(",")
            .filter((v) => v?.trim()?.length > 0);
        const attributeData = [
            {
                data: bredForData,
                type: DogAttributeType.BRED_FOR
            },
            {
                data: temperamentData,
                type: DogAttributeType.TEMPERAMENT
            }
        ];

        for (const { type, data } of attributeData) {
            for (const attr of data) {
                const { label, value } = dogApi.buildAttributeLabelAndValue(attr);

                const attribute = await prismaClient.dogAttribute.upsert({
                    where: {
                        type_value: {
                            type,
                            value
                        }
                    },
                    update: {},
                    create: { label, type, value }
                });
                await prismaClient.dogAttributesOnBreeds.upsert({
                    where: {
                        breedId_dogAttributeId: {
                            breedId: breedRecord.id,
                            dogAttributeId: attribute.id
                        }
                    },
                    update: {},
                    create: {
                        breedId: breedRecord.id,
                        dogAttributeId: attribute.id
                    }
                });
            }
        }
    }

    /**
     * Upsert Safety Levels
     */
    for (const { level, message } of safetyLevels) {
        await prismaClient.safetyLevel.upsert({
            where: { level },
            update: { message },
            create: { level, message }
        });
    }
}

seed()
    .catch((e) => {
        console.error(e);
        console.error("Database seed has failed");
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
