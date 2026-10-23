import z from "zod";
import { ZoneType } from "../generated/enums";
import prisma from "../config/database";
import { idSchema } from "../const";

const uniqueNameSchema = z
  .string()
  .min(2, "Le nom doit faire au moins 2 caractères")
  .refine(
    async (name) => {
      const exists = await prisma.zone.findUnique({ where: { name } });
      return !exists;
    },
    { message: "Cette zone existe déja dans la base de données." },
  );

const createZoneInputSchema = z.object({
  name: uniqueNameSchema,
  type: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(ZoneType, {
      error: () => `Le zone doit être : ${Object.values(ZoneType).join(", ")}`,
    }),
  ),
  altitude: z
    .number()
    .int()
    .positive({ error: "L'altitude doit être positive." })
    .optional(),
  description: z.string().optional(),
});

const updateZoneInputSchema = createZoneInputSchema.partial().extend({
  altitude: z
    .number()
    .int()
    .positive({ error: "L'altitude doit être positive." })
    .nullish(),
  description: z.string().nullish(),
});

export const createZoneSchema = z.object({
  body: createZoneInputSchema,
});

export const updateZoneSchema = z.object({
  params: z.object({ id: idSchema }),
  body: updateZoneInputSchema,
});

// types
export type TCreateZoneInput = z.infer<typeof createZoneInputSchema>;
export type TUpdateZoneInput = z.infer<typeof updateZoneInputSchema>;
