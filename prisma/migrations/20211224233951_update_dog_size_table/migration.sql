/*
  Warnings:

  - You are about to drop the column `dangerColdRiskFarenheitTemp` on the `DogSize` table. All the data in the column will be lost.
  - You are about to drop the column `levelOneDegreeRangeSize` on the `DogSize` table. All the data in the column will be lost.
  - You are about to drop the column `levelThreeDegreeRangeSize` on the `DogSize` table. All the data in the column will be lost.
  - You are about to drop the column `levelTwoDegreeRangeSize` on the `DogSize` table. All the data in the column will be lost.
  - You are about to drop the column `noColdRiskFarenheitTemp` on the `DogSize` table. All the data in the column will be lost.
  - Added the required column `coldSafetyLevelFiveFarenheitTemp` to the `DogSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coldSafetyLevelFourFarenheitTemp` to the `DogSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coldSafetyLevelOneFarenheitTemp` to the `DogSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coldSafetyLevelThreeFarenheitTemp` to the `DogSize` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coldSafetyLevelTwoFarenheitTemp` to the `DogSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DogSize` DROP COLUMN `dangerColdRiskFarenheitTemp`,
    DROP COLUMN `levelOneDegreeRangeSize`,
    DROP COLUMN `levelThreeDegreeRangeSize`,
    DROP COLUMN `levelTwoDegreeRangeSize`,
    DROP COLUMN `noColdRiskFarenheitTemp`,
    ADD COLUMN `coldSafetyLevelFiveFarenheitTemp` INTEGER NOT NULL,
    ADD COLUMN `coldSafetyLevelFourFarenheitTemp` INTEGER NOT NULL,
    ADD COLUMN `coldSafetyLevelOneFarenheitTemp` INTEGER NOT NULL,
    ADD COLUMN `coldSafetyLevelThreeFarenheitTemp` INTEGER NOT NULL,
    ADD COLUMN `coldSafetyLevelTwoFarenheitTemp` INTEGER NOT NULL;
