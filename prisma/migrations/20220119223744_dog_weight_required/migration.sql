/*
  Warnings:

  - Made the column `weightImperial` on table `Dog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weightMetric` on table `Dog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Dog` MODIFY `weightImperial` DOUBLE NOT NULL,
    MODIFY `weightMetric` DOUBLE NOT NULL;
