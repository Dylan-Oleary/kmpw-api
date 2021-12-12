import { PrismaClient, DogAttributeType } from "@prisma/client";

import { DogApiService } from "../src/services";

const prisma = new PrismaClient();

async function seed() {
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

        const breedUpsertData = {
            breedGroupId: breedGroupRecord.id,
            countryCode,
            description,
            dogApiId: id,
            name,
            origin,
            ...dogApi.formatBreedMeasurements(breed)
        };

        const breedRecord = await prisma.breed.upsert({
            where: { name },
            update: breedUpsertData,
            create: breedUpsertData
        });

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
