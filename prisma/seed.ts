import { PrismaClient } from "@prisma/client";

import { DogApiService } from "../src/services";

const prisma = new PrismaClient();

async function seed() {
    const dogApi = new DogApiService();
    const breeds = await dogApi.getBreeds();

    for (const breed of breeds) {
        const { alt_names, breed_group, description, height, id, life_span, name, origin, weight } =
            breed;
        let breedGroup = breed_group;

        if (!breed_group || breed_group?.trim().length === 0) {
            breedGroup = "Other";
        }

        const breedGroupRecord = await prisma.breedGroup.upsert({
            where: { name: breedGroup },
            update: {},
            create: { name: breedGroup }
        });

        const metricWeight = weight?.metric
            ?.replace("-", " ")
            ?.split(" ")
            ?.filter((v) => v?.trim().length > 0);
        const weightMetricMin = parseFloat(metricWeight[0]);
        const weightMetricMax = parseFloat(metricWeight[1] || metricWeight[0]);
        const weightMetricAvg = (weightMetricMin + weightMetricMax) / 2;

        const imperialWeight = weight?.imperial
            ?.replace("-", " ")
            ?.split(" ")
            ?.filter((v) => v?.trim().length > 0);
        const weightImperialMin = parseFloat(imperialWeight[0]);
        const weightImperialMax = parseFloat(imperialWeight[1] || imperialWeight[0]);
        const weightImperialAvg = (weightImperialMin + weightImperialMax) / 2;

        const imperialHeight = height?.imperial
            ?.replace("-", " ")
            ?.split(" ")
            ?.filter((v) => v?.trim().length > 0);
        const heightImperialMin = parseFloat(imperialHeight[0]);
        const heightImperialMax = parseFloat(imperialHeight[1] || imperialHeight[0]);
        const heightImperialAvg = (heightImperialMin + heightImperialMax) / 2;

        const metricHeight = height?.metric
            ?.replace("-", " ")
            ?.split(" ")
            ?.filter((v) => v?.trim().length > 0);
        const heightMetricMin = parseFloat(metricHeight[0]);
        const heightMetricMax = parseFloat(metricHeight[1] || metricHeight[0]);
        const heightMetricAvg = (heightMetricMin + heightMetricMax) / 2;

        const lifeSpan = life_span
            ?.replace("-", " ")
            ?.split(" ")
            ?.filter((v) => !isNaN(parseFloat(v)));
        const lifeSpanMin = parseFloat(lifeSpan[0]);
        const lifeSpanMax = parseFloat(lifeSpan[1] || lifeSpan[0]);
        const lifeSpanAvg = (lifeSpanMin + lifeSpanMax) / 2;

        const breedUpsertData = {
            altNames: alt_names,
            breedGroupId: breedGroupRecord.id,
            description,
            dogApiId: id,
            heightImperialMin,
            heightImperialMax,
            heightImperialAvg,
            heightMetricMin,
            heightMetricMax,
            heightMetricAvg,
            lifeSpanMin,
            lifeSpanMax,
            lifeSpanAvg,
            name,
            origin,
            weightMetricMin,
            weightMetricMax,
            weightMetricAvg,
            weightImperialMin,
            weightImperialMax,
            weightImperialAvg
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
