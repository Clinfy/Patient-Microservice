-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GENERAL', 'CONTACT', 'BILLING', 'COVERAGE', 'GUARDIAN', 'WARNING');

-- CreateEnum
CREATE TYPE "AffiliateType" AS ENUM ('HOLDER', 'MEMBER', 'FAMILY_GROUP', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('SON', 'DAUGHTER', 'MOTHER', 'FATHER', 'SIBLING', 'SPOUSE', 'TUTOR', 'CAREGIVER', 'LEGAL_GUARDIAN', 'OTHER');

-- CreateTable
CREATE TABLE "coverage_provider" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "provider_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "coverage_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "destination" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "claimed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "person_id" UUID NOT NULL,
    "medical_record_number" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_administrative_note" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "patient_id" UUID NOT NULL,
    "note" VARCHAR(500) NOT NULL,
    "category" "CategoryType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "patient_administrative_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_coverage" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "patient_id" UUID NOT NULL,
    "coverage_provider_id" UUID NOT NULL,
    "provider_plan_id" UUID NOT NULL,
    "member_number" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" DATE NOT NULL,
    "valid_until" DATE,
    "notes" VARCHAR(250),
    "affiliate_type" "AffiliateType" NOT NULL,
    "relationship_type" "RelationshipType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "patient_coverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_related_contact" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "patient_id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "relationship_type" "RelationshipType" NOT NULL,
    "is_emergency_contact" BOOLEAN NOT NULL DEFAULT false,
    "is_default_contact" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "note" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "patient_related_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_plan" (
    "id" UUID NOT NULL DEFAULT uuidv7(),
    "plan_name" TEXT NOT NULL,
    "plan_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "coverage_provider_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" JSONB,

    CONSTRAINT "provider_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_coverage_provider_provider_name" ON "coverage_provider"("provider_name");

-- CreateIndex
CREATE INDEX "idx_outbox_sent_cleanup" ON "outbox"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_patient_person_id" ON "patient"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_patient_medical_record_number" ON "patient"("medical_record_number");

-- CreateIndex
CREATE INDEX "IDX_patient_person_id" ON "patient"("person_id");

-- CreateIndex
CREATE INDEX "IDX_patient_medical_record_number" ON "patient"("medical_record_number");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_provider_plan_name" ON "provider_plan"("coverage_provider_id", "plan_name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_provider_plan_code" ON "provider_plan"("coverage_provider_id", "plan_code");

-- AddForeignKey
ALTER TABLE "patient_administrative_note" ADD CONSTRAINT "patient_administrative_note_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_coverage" ADD CONSTRAINT "patient_coverage_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_coverage" ADD CONSTRAINT "patient_coverage_coverage_provider_id_fkey" FOREIGN KEY ("coverage_provider_id") REFERENCES "coverage_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_coverage" ADD CONSTRAINT "patient_coverage_provider_plan_id_fkey" FOREIGN KEY ("provider_plan_id") REFERENCES "provider_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_related_contact" ADD CONSTRAINT "patient_related_contact_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_plan" ADD CONSTRAINT "provider_plan_coverage_provider_id_fkey" FOREIGN KEY ("coverage_provider_id") REFERENCES "coverage_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
