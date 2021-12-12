export interface IDogApiBreed {
    id: number;
    bred_for: string;
    breed_group: string;
    country_code?: string;
    description?: string;
    height: {
        imperial: string;
    };
    life_span: string;
    name: string;
    origin?: string;
    temperament: string;
    weight: {
        imperial: string;
    };
}

export interface IDogApiGetBreedsParams {
    page?: number;
    limit?: number;
}
