import { BreedSource } from "@prisma/client";

import { IDogApiBreed } from "./DogApi";

export type CustomBreed = Partial<IDogApiBreed> & {
    life_span: LifeSpan;
    name: string;
    source: BreedSource;
    weight: {
        imperial: Range;
    };
};

export type LifeSpan = `${Range} years` | `${number} years`;
export type Range = `${number} - ${number}`;
