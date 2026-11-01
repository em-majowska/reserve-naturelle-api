import prisma from "../config/database";
import { TId } from "../const";
import {
  TCreateSpeciesInput,
  TQueryParamsInputSchema,
  TUpdateSpeciesInput,
} from "../schemas/speciesSchemas";
import { TSpecies, TZone } from "../types";

export const getAll = async (
  filters: TQueryParamsInputSchema,
): Promise<TSpecies[] | []> => {
  const where: any = {};

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.status) {
    where.protectionStatus = filters.status;
  }
  if (filters.search) {
    where.commonName = { contains: filters.search, mode: "insensitive" };
  }

  return prisma.species.findMany({ where });
};

export const getById = async (id: TId): Promise<TSpecies | null> => {
  return prisma.species.findUniqueOrThrow({
    where: { id },
    include: {
      zones: true,
      observations: {
        orderBy: { observedAt: "desc" },
        take: 10,
        include: { zone: { select: { name: true } } },
      },
    },
  });
};

export const create = async (
  data: TCreateSpeciesInput,
): Promise<TSpecies | null> => {
  return prisma.species.create({ data });
};

export const update = async (
  id: TId,
  data: TUpdateSpeciesInput,
): Promise<TSpecies | null> => {
  return prisma.species.update({ where: { id }, data });
};

export const remove = async (id: TId): Promise<TSpecies | null> => {
  return prisma.species.delete({ where: { id } });
};

export const addSpeciesToZone = async (
  id: TId,
  zoneId: TId,
): Promise<TZone | null> => {
  return prisma.zone.update({
    where: { id: zoneId },
    data: { species: { connect: { id } } },
    include: { species: { select: { commonName: true } } },
  });
};
export const removeSpeciesFromZone = async (
  id: TId,
  zoneId: TId,
): Promise<TZone | null> => {
  return prisma.zone.update({
    where: { id: zoneId },
    data: { species: { disconnect: { id } } },
    include: { species: { select: { commonName: true } } },
  });
};
