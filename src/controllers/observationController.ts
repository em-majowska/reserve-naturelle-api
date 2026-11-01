import { NextFunction, Request, Response } from "express";
import * as observationService from "../services/observationService";
import {
  TCreateObservationInput,
  TQueryObservationInputSchema,
} from "../schemas/observationSchemas";
import { TId } from "../const";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const zoneId = req.query.zoneId ? Number(req.query.zoneId) : undefined;
    const speciesId = req.query.speciesId
      ? Number(req.query.speciesId)
      : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const perPage = req.query.perPage ? Number(req.query.perPage) : undefined;

    const result = await observationService.getAllObservations({
      zoneId,
      speciesId,
      page,
      perPage,
    } as TQueryObservationInputSchema);
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
    const observation = await observationService.getObservationById(
      Number(req.params.id) as TId,
    );

    if (!observation) {
      res.status(404).json({ error: "Observation not found" });
      return;
    }

    return res.status(200).json(observation);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request<{}, {}, TCreateObservationInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const observation = await observationService.createObservation(req.body);
    return res.status(201).json(observation);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await observationService.removeObservation(Number(req.params.id) as TId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
