-- CreateTable
CREATE TABLE `SafetyIndex` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `level` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SafetyIndex_level_key`(`level`),
    UNIQUE INDEX `SafetyIndex_message_key`(`message`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
