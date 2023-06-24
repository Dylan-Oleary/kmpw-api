-- CreateEnum
CREATE TYPE "UserIdentityProvider" AS ENUM ('LOCAL');

-- CreateEnum
CREATE TYPE "DogAttributeType" AS ENUM ('BRED_FOR', 'TEMPERAMENT');

-- CreateEnum
CREATE TYPE "WeightClass" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "BreedSource" AS ENUM ('CUSTOM', 'DOG_API');

-- CreateTable
CREATE TABLE "BreedGroup" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "name" STRING NOT NULL,
    "description" STRING,

    CONSTRAINT "BreedGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "name" STRING NOT NULL,
    "description" STRING,
    "dogApiId" INT4,
    "altNames" STRING,
    "countryCode" STRING,
    "heightImperialMin" FLOAT8,
    "heightImperialMax" FLOAT8,
    "heightImperialAvg" FLOAT8,
    "heightMetricMin" FLOAT8,
    "heightMetricMax" FLOAT8,
    "heightMetricAvg" FLOAT8,
    "lifeSpanMin" FLOAT8,
    "lifeSpanMax" FLOAT8,
    "lifeSpanAvg" FLOAT8,
    "origin" STRING,
    "source" "BreedSource",
    "weightImperialMin" FLOAT8,
    "weightImperialMax" FLOAT8,
    "weightImperialAvg" FLOAT8,
    "weightMetricMin" FLOAT8,
    "weightMetricMax" FLOAT8,
    "weightMetricAvg" FLOAT8,
    "wikipediaUrl" STRING,
    "breedGroupId" STRING NOT NULL,
    "sizeId" STRING NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dog" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "name" STRING NOT NULL,
    "description" STRING,
    "birthday" TIMESTAMP(3),
    "profilePicture" STRING,
    "heightImperial" FLOAT8,
    "heightMetric" FLOAT8,
    "weightImperial" FLOAT8 NOT NULL,
    "weightMetric" FLOAT8 NOT NULL,
    "altNames" STRING,
    "breedId" STRING NOT NULL,
    "sizeId" STRING NOT NULL,
    "userId" STRING,

    CONSTRAINT "Dog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogAttribute" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "isGeneratedByUser" BOOL NOT NULL DEFAULT false,
    "label" STRING NOT NULL,
    "value" STRING NOT NULL,
    "type" "DogAttributeType" NOT NULL,

    CONSTRAINT "DogAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogAttributesOnBreeds" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "breedId" STRING NOT NULL,
    "dogAttributeId" STRING NOT NULL,

    CONSTRAINT "DogAttributesOnBreeds_pkey" PRIMARY KEY ("breedId","dogAttributeId")
);

-- CreateTable
CREATE TABLE "DogAttributesOnDogs" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "dogId" STRING NOT NULL,
    "dogAttributeId" STRING NOT NULL,

    CONSTRAINT "DogAttributesOnDogs_pkey" PRIMARY KEY ("dogId","dogAttributeId")
);

-- CreateTable
CREATE TABLE "DogSize" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "weightClass" "WeightClass" NOT NULL,
    "weightImperialMin" FLOAT8 NOT NULL,
    "weightImperialMax" FLOAT8 NOT NULL,
    "weightImperialAvg" FLOAT8 NOT NULL,
    "weightMetricMin" FLOAT8 NOT NULL,
    "weightMetricMax" FLOAT8 NOT NULL,
    "weightMetricAvg" FLOAT8 NOT NULL,
    "coldSafetyLevelOneFarenheitTemp" INT4 NOT NULL,
    "coldSafetyLevelTwoFarenheitTemp" INT4 NOT NULL,
    "coldSafetyLevelThreeFarenheitTemp" INT4 NOT NULL,
    "coldSafetyLevelFourFarenheitTemp" INT4 NOT NULL,
    "coldSafetyLevelFiveFarenheitTemp" INT4 NOT NULL,

    CONSTRAINT "DogSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyLevel" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "level" INT4 NOT NULL,
    "message" STRING NOT NULL,

    CONSTRAINT "SafetyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reauthenticationAt" TIMESTAMP(3),
    "isDeleted" BOOL NOT NULL DEFAULT false,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "identityProvider" "UserIdentityProvider" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BreedGroup_name_key" ON "BreedGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_name_key" ON "Breed"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_dogApiId_key" ON "Breed"("dogApiId");

-- CreateIndex
CREATE UNIQUE INDEX "DogAttribute_type_value_key" ON "DogAttribute"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "DogSize_weightClass_key" ON "DogSize"("weightClass");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyLevel_level_key" ON "SafetyLevel"("level");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyLevel_message_key" ON "SafetyLevel"("message");

-- CreateIndex
CREATE UNIQUE INDEX "SafetyLevel_level_message_key" ON "SafetyLevel"("level", "message");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Breed" ADD CONSTRAINT "Breed_breedGroupId_fkey" FOREIGN KEY ("breedGroupId") REFERENCES "BreedGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breed" ADD CONSTRAINT "Breed_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "DogSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "DogSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogAttributesOnBreeds" ADD CONSTRAINT "DogAttributesOnBreeds_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogAttributesOnBreeds" ADD CONSTRAINT "DogAttributesOnBreeds_dogAttributeId_fkey" FOREIGN KEY ("dogAttributeId") REFERENCES "DogAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogAttributesOnDogs" ADD CONSTRAINT "DogAttributesOnDogs_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogAttributesOnDogs" ADD CONSTRAINT "DogAttributesOnDogs_dogAttributeId_fkey" FOREIGN KEY ("dogAttributeId") REFERENCES "DogAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
