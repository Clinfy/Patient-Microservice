/*
  Warnings:

  - The `medical_record_number` column on the `patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "patient" DROP COLUMN "medical_record_number",
ADD COLUMN     "medical_record_number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UQ_patient_medical_record_number" ON "patient"("medical_record_number");

-- CreateIndex
CREATE INDEX "IDX_patient_medical_record_number" ON "patient"("medical_record_number");
