export interface IDogApiBreed {
    id: number;
    bred_for: string;
    breed_group: string;
    description?: string;
    height: {
        imperial: string;
        metric: string;
    };
    life_span: string;
    name: string;
    origin?: string;
    temperament: string;
    weight: {
        imperial: string;
        metric: string;
    };
}

export interface IDogApiGetBreedsParams {
    page?: number;
    limit?: number;
}
