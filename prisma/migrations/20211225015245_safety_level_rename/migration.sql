/*
  Warnings:

  - You are about to drop the `SafetyIndex` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SafetyIndex`;

-- CreateTable
CREATE TABLE `SafetyLevel` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `level` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SafetyLevel_level_key`(`level`),
    UNIQUE INDEX `SafetyLevel_message_key`(`message`),
    UNIQUE INDEX `SafetyLevel_level_message_key`(`level`, `message`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
