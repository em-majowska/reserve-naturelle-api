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
    const result = await observationService.getAllObservations(
      req.query as unknown as TQueryObservationInputSchema,
    );
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
      req.params.id as unknown as TId,
    );
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
  req: Request<{ id: TId }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await observationService.removeObservation(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
