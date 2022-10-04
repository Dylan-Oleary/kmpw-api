import { BreedSource } from "@prisma/client";

import { CustomBreed } from "../../src/types";

export const customBreeds: CustomBreed[] = [
    {
        name: "Jack Russell Terrier",
        life_span: "13 - 16 years",
        source: BreedSource.CUSTOM,
        weight: {
            imperial: "13 - 18"
        }
    }
];
