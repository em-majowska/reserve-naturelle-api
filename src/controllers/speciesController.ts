import { NextFunction, Request, Response } from "express";
import * as speciesService from "../services/speciesService";

import { TId } from "../const";
import {
  TCreateSpeciesInput,
  TQueryParamsInputSchema,
  TUpdateSpeciesInput,
} from "../schemas/speciesSchemas";

export const getAll = async (
  req: Request<{}, {}, {}, TQueryParamsInputSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await speciesService.getAll(req.query);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const species = await speciesService.getById(
      req.params.id as unknown as TId,
    );
    return res.status(200).json(species);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request<{}, {}, TCreateSpeciesInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const species = await speciesService.create(req.body);
    return res.status(201).json(species);
  } catch (error) {
    next(error);
  }
};
export const update = async (
  req: Request<any, {}, TUpdateSpeciesInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const species = await speciesService.update(
      req.params.id as unknown as TId,
      req.body,
    );
    return res.status(200).json(species);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request<{ id: TId }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await speciesService.remove(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addSpecies = async (
  req: Request<any, {}, { zoneId: TId }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await speciesService.addSpeciesToZone(
      req.params.id as unknown as TId,
      req.body.zoneId,
    );
    const species = await speciesService.getById(
      req.params.id as unknown as TId,
    );
    return res.status(201).json(species);
  } catch (error) {
    next(error);
  }
};

export const removeSpecies = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await speciesService.removeSpeciesFromZone(
      req.params.id as unknown as TId,
      req.params.zoneId as unknown as TId,
    );
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
