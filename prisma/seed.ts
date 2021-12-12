import { DogAttributeType, DogSize, PrismaClient } from "@prisma/client";

import { dogSizes } from "./data/sizes";
import { DogApiService } from "../src/services";

const prisma = new PrismaClient();

async function seed() {
    /**
     * Upsert Dog Sizes
     */
    const dogSizeRecords: DogSize[] = [];

    for (const size of dogSizes) {
        const dogSizeRecord = await prisma.dogSize.upsert({
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

    for (const breed of breeds) {
        const {
            bred_for = "",
            country_code: countryCode,
            description,
            id,
            name,
            origin,
            temperament = ""
        } = breed;
        const breedGroup = dogApi.getBreedGroupFromBreed(breed);

        const breedGroupRecord = await prisma.breedGroup.upsert({
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
            ...breedMeasurements
        };

        const breedRecord = await prisma.breed.upsert({
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

                const attribute = await prisma.dogAttribute.upsert({
                    where: {
                        type_value: {
                            type,
                            value
                        }
                    },
                    update: {},
                    create: { label, type, value }
                });
                await prisma.dogAttributesOnBreeds.upsert({
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
}

seed()
    .catch((e) => {
        console.error(e);
        console.error("Database seed has failed");
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
