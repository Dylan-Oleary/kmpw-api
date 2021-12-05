-- CreateTable
CREATE TABLE `BreedGroup` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `BreedGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Breed` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `altNames` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `experimental` BOOLEAN NOT NULL DEFAULT false,
    `hairless` BOOLEAN NOT NULL DEFAULT false,
    `heightImperialMin` DOUBLE NOT NULL,
    `heightImperialMax` DOUBLE NOT NULL,
    `heightImperialAvg` DOUBLE NOT NULL,
    `heightMetricMin` DOUBLE NOT NULL,
    `heightMetricMax` DOUBLE NOT NULL,
    `heightMetricAvg` DOUBLE NOT NULL,
    `hypoallergenic` BOOLEAN NOT NULL DEFAULT false,
    `lifeSpanMin` DOUBLE NOT NULL,
    `lifeSpanMax` DOUBLE NOT NULL,
    `lifeSpanAvg` DOUBLE NOT NULL,
    `natural` BOOLEAN NOT NULL DEFAULT false,
    `origin` VARCHAR(191) NOT NULL,
    `weightImperialMin` DOUBLE NOT NULL,
    `weightImperialMax` DOUBLE NOT NULL,
    `weightImperialAvg` DOUBLE NOT NULL,
    `weightMetricMin` DOUBLE NOT NULL,
    `weightMetricMax` DOUBLE NOT NULL,
    `weightMetricAvg` DOUBLE NOT NULL,
    `wikipediaUrl` VARCHAR(191) NULL,
    `breedGroupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Breed_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DogAttribute` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isGeneratedByUser` BOOLEAN NOT NULL DEFAULT false,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `type` ENUM('BRED_FOR', 'TEMPERAMENT') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DogAttributesOnBreeds` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `breedId` VARCHAR(191) NOT NULL,
    `dogAttributeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`breedId`, `dogAttributeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DogAttributesOnBreedGroups` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `breedGroupId` VARCHAR(191) NOT NULL,
    `dogAttributeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`breedGroupId`, `dogAttributeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Breed` ADD CONSTRAINT `Breed_breedGroupId_fkey` FOREIGN KEY (`breedGroupId`) REFERENCES `BreedGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreeds` ADD CONSTRAINT `DogAttributesOnBreeds_breedId_fkey` FOREIGN KEY (`breedId`) REFERENCES `Breed`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreeds` ADD CONSTRAINT `DogAttributesOnBreeds_dogAttributeId_fkey` FOREIGN KEY (`dogAttributeId`) REFERENCES `DogAttribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreedGroups` ADD CONSTRAINT `DogAttributesOnBreedGroups_breedGroupId_fkey` FOREIGN KEY (`breedGroupId`) REFERENCES `BreedGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreedGroups` ADD CONSTRAINT `DogAttributesOnBreedGroups_dogAttributeId_fkey` FOREIGN KEY (`dogAttributeId`) REFERENCES `DogAttribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
