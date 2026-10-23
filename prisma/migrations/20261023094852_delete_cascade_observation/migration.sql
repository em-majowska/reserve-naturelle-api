-- DropForeignKey
ALTER TABLE "Observation" DROP CONSTRAINT "Observation_speciesId_fkey";

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;
