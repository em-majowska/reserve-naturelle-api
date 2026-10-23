import prisma from "../config/database";
import { TId } from "../const";
import { TCreateZoneInput, TUpdateZoneInput } from "../schemas/zoneSchemas";
import { TZone } from "../types";

export const getAll = async (): Promise<TZone[] | []> => {
  return prisma.zone.findMany();
};

export const getById = async (id: TId): Promise<TZone | null> => {
  return prisma.zone.findUniqueOrThrow({
    where: { id },
    include: { species: true },
  });
};

export const create = async (data: TCreateZoneInput): Promise<TZone | null> => {
  return prisma.zone.create({ data });
};

export const update = async (
  id: TId,
  data: TUpdateZoneInput,
): Promise<TZone | null> => {
  return prisma.zone.update({ where: { id }, data });
};

export const remove = async (id: TId): Promise<TZone | null> => {
  return prisma.zone.delete({ where: { id } });
};
