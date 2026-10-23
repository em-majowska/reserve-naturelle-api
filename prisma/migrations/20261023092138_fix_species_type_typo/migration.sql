/*
  Warnings:

  - The values [MAMMIFIÈRE] on the enum `SpeciesType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpeciesType_new" AS ENUM ('MAMMIFÈRE', 'OISEAU', 'REPTILE', 'AMPHIBIEN', 'INSECTE', 'PLANTE');
ALTER TABLE "Species" ALTER COLUMN "type" TYPE "SpeciesType_new" USING ("type"::text::"SpeciesType_new");
ALTER TYPE "SpeciesType" RENAME TO "SpeciesType_old";
ALTER TYPE "SpeciesType_new" RENAME TO "SpeciesType";
DROP TYPE "public"."SpeciesType_old";
COMMIT;
