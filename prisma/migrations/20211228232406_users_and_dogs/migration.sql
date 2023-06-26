-- CreateTable
CREATE TABLE `Dog` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `birthday` DATETIME(3) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `heightImperial` DOUBLE NULL,
    `heightMetric` DOUBLE NULL,
    `weightImperial` DOUBLE NULL,
    `weightMetric` DOUBLE NULL,
    `altNames` VARCHAR(191) NULL,
    `breedId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DogAttributesOnDogs` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `dogId` VARCHAR(191) NOT NULL,
    `dogAttributeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`dogId`, `dogAttributeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `identityProvider` ENUM('LOCAL') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dog` ADD CONSTRAINT `Dog_breedId_fkey` FOREIGN KEY (`breedId`) REFERENCES `Breed`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dog` ADD CONSTRAINT `Dog_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `DogSize`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnDogs` ADD CONSTRAINT `DogAttributesOnDogs_dogId_fkey` FOREIGN KEY (`dogId`) REFERENCES `Dog`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DogAttributesOnDogs` ADD CONSTRAINT `DogAttributesOnDogs_dogAttributeId_fkey` FOREIGN KEY (`dogAttributeId`) REFERENCES `DogAttribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
