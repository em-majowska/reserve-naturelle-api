import z from "zod";
import prisma from "../config/database";
import { ProtectionStatus, SpeciesType } from "../generated/enums";
import { idSchema } from "../const";

const uniqueNameSchema = z
  .string()
  .min(5, "Le scientificName doit faire au moins 5 caractères")
  .refine(
    async (scientificName) => {
      const exists = await prisma.species.findUnique({
        where: { scientificName },
      });
      return !exists;
    },
    { message: "Ce scientificName existe déja dans la base de données." },
  );

const speciesTypeSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.toUpperCase() : val),
  z.enum(SpeciesType, {
    error: () => `Le type doit être : ${Object.values(SpeciesType).join(", ")}`,
  }),
);
const protectionStatusSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.toUpperCase() : val),
  z.enum(ProtectionStatus, {
    error: () =>
      `Le protectionStatus doit être : ${Object.values(ProtectionStatus).join(", ")}`,
  }),
);

const queryParamsInputSchema = z.object({
  type: speciesTypeSchema.optional(),
  status: protectionStatusSchema.optional(),
  search: z.string().optional(),
});

export const queryParamsSchema = z.object({
  query: queryParamsInputSchema,
});

const createSpeciesInputSchema = z.object({
  commonName: z
    .string()
    .min(2, "Le commonName doit faire au moins 2 caractères"),
  scientificName: uniqueNameSchema,
  type: speciesTypeSchema,
  protectionStatus: protectionStatusSchema,
});

const updateSpeciesInputSchema = createSpeciesInputSchema.partial();

export const createSpeciesSchema = z.object({ body: createSpeciesInputSchema });

export const updateSpeciesSchema = z.object({
  params: z.object({ id: idSchema }),
  body: updateSpeciesInputSchema,
});

export const addSpeciesToZoneSchema = z.object({
  params: z.object({ id: idSchema }),
  body: z.object({ zoneId: idSchema }),
});
export const removeSpeciesToZoneSchema = z.object({
  params: z.object({ id: idSchema, zoneId: idSchema }),
});

// types
export type TCreateSpeciesInput = z.infer<typeof createSpeciesInputSchema>;
export type TUpdateSpeciesInput = z.infer<typeof updateSpeciesInputSchema>;
export type TQueryParamsInputSchema = z.infer<typeof queryParamsInputSchema>;
