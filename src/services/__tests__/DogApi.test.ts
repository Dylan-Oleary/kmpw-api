import { DogApiService } from "../index";

describe("Dog API Service", () => {
    const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);
    const testBreeds = [
        {
            bred_for: "Small rodent hunting, lapdog",
            breed_group: "Toy",
            height: {
                imperial: "9 - 11.5",
                metric: "23 - 29"
            },
            id: 1,
            life_span: "10 - 12 years",
            name: "Affenpinscher",
            origin: "Germany, France",
            temperament: "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
            weight: {
                imperial: "6 - 13",
                metric: "3 - 6"
            }
        },
        {
            bred_for: "Coursing and hunting",
            breed_group: "Hound",
            country_code: "AG",
            height: {
                imperial: "25 - 27",
                metric: "64 - 69"
            },
            id: 2,
            life_span: "10 - 13 years",
            name: "Afghan Hound",
            origin: "Afghanistan, Iran, Pakistan",
            temperament: "Aloof, Clownish, Dignified, Independent, Happy",
            weight: {
                imperial: "50 - 60",
                metric: "23 - 27"
            }
        },
        {
            bred_for: "Cattle herdering, hunting snakes and rodents",
            breed_group: "Terrier",
            country_code: "AU",
            height: {
                imperial: "10 - 11",
                metric: "25 - 28"
            },
            id: 24,
            life_span: "50 years",
            name: "Australian Terrier",
            temperament: "Spirited, Alert, Loyal, Companionable, Even Tempered, Courageous",
            weight: {
                imperial: "14 - 16",
                metric: "6 - 7"
            }
        }
    ];

    describe("formatBreedMeasurements", () => {
        test("returns the expected values", () => {
            const service = new DogApiService();
            const testBreed = { ...testBreeds[0] };
            const expectedMeasurements = {
                heightImperialMin: 9,
                heightImperialMax: 11.5,
                heightImperialAvg: 10.25,
                heightMetricMin: 23,
                heightMetricMax: 29,
                heightMetricAvg: 26,
                weightImperialMin: 6,
                weightImperialMax: 13,
                weightImperialAvg: 9.5,
                weightMetricMin: 3,
                weightMetricMax: 6,
                weightMetricAvg: 4.5,
                lifeSpanAvg: 11,
                lifeSpanMin: 10,
                lifeSpanMax: 12
            };

            const formattedMeasurements = service.formatBreedMeasurements(testBreed);

            expect(formattedMeasurements).toEqual(expectedMeasurements);
        });
    }); // close describe("formatBreedMeasurement")

    describe("formatSingleBreedMeasurement", () => {
        const testCases: {
            value: string;
            expected: { min?: number; max?: number; avg?: number };
        }[] = [
            {
                value: "12 - 15 years",
                expected: { avg: 13.5, max: 15, min: 12 }
            },
            {
                value: "10 - 20",
                expected: { avg: 15, max: 20, min: 10 }
            },
            {
                value: "50",
                expected: { avg: 50, max: 50, min: 50 }
            },
            {
                value: null,
                expected: {}
            },
            {
                value: undefined,
                expected: {}
            },
            {
                value: "",
                expected: {}
            }
        ];

        for (const { expected, value } of testCases) {
            test(`returns expected result when '${String(value)}' is passed`, () => {
                const service = new DogApiService();
                const result = service.formatSingleBreedMeasurement(value);

                expect(result).toEqual(expected);
            });
        }
    }); // close describe("formatSingleBreedMeasurement")

    describe("getBreedGroupFromBreed", () => {
        test("returns the correct breed group", () => {
            const service = new DogApiService();
            const breed = testBreeds[getRandomIndex(testBreeds)];
            const breedGroup = service.getBreedGroupFromBreed(breed);

            expect(breedGroup).toEqual(breed.breed_group).toBeString();
        });

        test("returns the expected value when passed breed group is an empty string", () => {
            const service = new DogApiService();
            const breed = { ...testBreeds[getRandomIndex(testBreeds)], breed_group: " " };
            const breedGroup = service.getBreedGroupFromBreed(breed);

            expect(breedGroup).toEqual("Other");
        });

        test("returns the expected value when no breed group exists on the breed", () => {
            const service = new DogApiService();
            const breed = { ...testBreeds[getRandomIndex(testBreeds)] };

            delete breed.breed_group;

            const breedGroup = service.getBreedGroupFromBreed(breed);

            expect(breedGroup).toEqual("Other");
        });
    }); // close describe("getBreedGroupFromBreed")
}); // close describe("Dog API Service")
