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
    `dogApiId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `altNames` VARCHAR(191) NULL,
    `heightImperialMin` DOUBLE NULL,
    `heightImperialMax` DOUBLE NULL,
    `heightImperialAvg` DOUBLE NULL,
    `heightMetricMin` DOUBLE NULL,
    `heightMetricMax` DOUBLE NULL,
    `heightMetricAvg` DOUBLE NULL,
    `lifeSpanMin` DOUBLE NULL,
    `lifeSpanMax` DOUBLE NULL,
    `lifeSpanAvg` DOUBLE NULL,
    `origin` VARCHAR(191) NULL,
    `weightImperialMin` DOUBLE NULL,
    `weightImperialMax` DOUBLE NULL,
    `weightImperialAvg` DOUBLE NULL,
    `weightMetricMin` DOUBLE NULL,
    `weightMetricMax` DOUBLE NULL,
    `weightMetricAvg` DOUBLE NULL,
    `wikipediaUrl` VARCHAR(191) NULL,
    `breedGroupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Breed_dogApiId_key`(`dogApiId`),
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

-- AddForeignKey
ALTER TABLE `Breed` ADD CONSTRAINT `Breed_breedGroupId_fkey` FOREIGN KEY (`breedGroupId`) REFERENCES `BreedGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreeds` ADD CONSTRAINT `DogAttributesOnBreeds_breedId_fkey` FOREIGN KEY (`breedId`) REFERENCES `Breed`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnBreeds` ADD CONSTRAINT `DogAttributesOnBreeds_dogAttributeId_fkey` FOREIGN KEY (`dogAttributeId`) REFERENCES `DogAttribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
