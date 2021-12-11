/*
  Warnings:

  - A unique constraint covering the columns `[type,value]` on the table `DogAttribute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DogAttribute_type_value_key` ON `DogAttribute`(`type`, `value`);
