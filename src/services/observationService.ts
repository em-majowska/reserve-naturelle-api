import prisma from "../config/database";
import { TId } from "../const";
import {
  TCreateObservationInput,
  TQueryObservationInputSchema,
} from "../schemas/observationSchemas";
import { TGetAllObservations, TObservation } from "../types";

export const getAllObservations = async (
  params: TQueryObservationInputSchema,
): Promise<TGetAllObservations> => {
  const { zoneId, speciesId, page, perPage } = params;
  const where: any = {};

  if (zoneId) {
    where.zoneId = zoneId;
  }

  if (speciesId) {
    where.speciesId = speciesId;
  }

  const [observations, total] = await Promise.all([
    prisma.observation.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { observedAt: "desc" },
      include: {
        zoneId: false,
        speciesId: false,
        zone: { select: { name: true } },
        species: { select: { commonName: true } },
      },
    }),
    prisma.observation.count({ where }),
  ]);

  return {
    data: observations,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

export const getObservationById = async (
  id: TId,
): Promise<TObservation | null> => {
  return prisma.observation.findUniqueOrThrow({
    where: { id },
    include: {
      zone: { select: { name: true } },
      species: { select: { commonName: true } },
    },
  });
};

export const createObservation = async (
  data: TCreateObservationInput,
): Promise<Omit<TObservation, "zone" | "species"> | null> => {
  return prisma.observation.create({ data });
};

export const removeObservation = async (
  id: TId,
): Promise<Omit<TObservation, "zone" | "species"> | null> => {
  return prisma.observation.delete({ where: { id } });
};
