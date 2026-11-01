import z from "zod";
import { idSchema } from "../const";

const createObservationInputSchema = z.object({
  quantity: z.number().int().min(1, "La quantité doit être au moins 1"),
  notes: z.string().optional(),
  speciesId: idSchema,
  zoneId: idSchema,
});

const queryObservationInputSchema = z.object({
  zoneId: idSchema.optional(),
  speciesId: idSchema.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().optional().default(20),
});

const updateObservationInputSchema = createObservationInputSchema.partial();

export const getObservationsSchema = z.object({
  query: queryObservationInputSchema,
});

export const createObservationSchema = z.object({
  body: createObservationInputSchema,
});

export const updateObservationSchema = z.object({
  body: updateObservationInputSchema,
});

// types
export type TCreateObservationInput = z.infer<
  typeof createObservationInputSchema
>;
export type TUpdateObservationInput = z.infer<
  typeof updateObservationInputSchema
>;
export type TQueryObservationInputSchema = z.infer<
  typeof queryObservationInputSchema
>;
