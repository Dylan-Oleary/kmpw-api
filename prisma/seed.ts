import { PrismaClient } from "@prisma/client";

import { DogApiService } from "../src/services";

const prisma = new PrismaClient();

async function seed() {
    const dogApi = new DogApiService();
    const breeds = await dogApi.getBreeds();

    for (const breed of breeds) {
        const { description, id, name, origin } = breed;
        const breedGroup = dogApi.getBreedGroupFromBreed(breed);

        const breedGroupRecord = await prisma.breedGroup.upsert({
            where: { name: breedGroup },
            update: {},
            create: { name: breedGroup }
        });

        const breedUpsertData = {
            breedGroupId: breedGroupRecord.id,
            description,
            dogApiId: id,
            name,
            origin,
            ...dogApi.formatBreedMeasurements(breed)
        };

        await prisma.breed.upsert({
            where: { name },
            update: breedUpsertData,
            create: breedUpsertData
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
        await prisma.$disconnect();
    });
