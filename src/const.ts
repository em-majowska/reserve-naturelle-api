import z from "zod";

export const idSchema = z.coerce.number().int().positive();
export const paramsIdSchema = z.object({
  params: z.object({ id: idSchema }),
});

export type TId = z.infer<typeof idSchema>;
