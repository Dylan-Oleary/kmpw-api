/*
  Warnings:

  - Added the required column `sizeId` to the `Breed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Breed` ADD COLUMN `sizeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `DogSize` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `weightClass` ENUM('SMALL', 'MEDIUM', 'LARGE') NOT NULL,
    `weightImperialMin` DOUBLE NOT NULL,
    `weightImperialMax` DOUBLE NOT NULL,
    `weightImperialAvg` DOUBLE NOT NULL,
    `weightMetricMin` DOUBLE NOT NULL,
    `weightMetricMax` DOUBLE NOT NULL,
    `weightMetricAvg` DOUBLE NOT NULL,
    `levelOneDegreeRangeSize` INTEGER NOT NULL,
    `levelTwoDegreeRangeSize` INTEGER NOT NULL,
    `levelThreeDegreeRangeSize` INTEGER NOT NULL,
    `noColdRiskFarenheitTemp` INTEGER NOT NULL,
    `dangerColdRiskFarenheitTemp` INTEGER NOT NULL,

    UNIQUE INDEX `DogSize_weightClass_key`(`weightClass`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Breed` ADD CONSTRAINT `Breed_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `DogSize`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
