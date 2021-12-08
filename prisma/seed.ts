import { PrismaClient } from "@prisma/client";

import { DogApiService } from "../src/services";

const prisma = new PrismaClient();

async function seed() {
    const dogApi = new DogApiService();

    const breeds = await dogApi.getBreeds();

    console.info(breeds);
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
