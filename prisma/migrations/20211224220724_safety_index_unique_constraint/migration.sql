/*
  Warnings:

  - A unique constraint covering the columns `[level,message]` on the table `SafetyIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SafetyIndex_level_message_key` ON `SafetyIndex`(`level`, `message`);
