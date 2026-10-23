import { NextFunction, Request, Response } from "express";
import * as zoneService from "../services/zoneService";

import { TId } from "../const";
import { TCreateZoneInput, TUpdateZoneInput } from "../schemas/zoneSchemas";

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await zoneService.getAll();
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
    const zone = await zoneService.getById(req.params.id as unknown as TId);
    return res.status(200).json(zone);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request<{}, {}, TCreateZoneInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const species = await zoneService.create(req.body);
    return res.status(201).json(species);
  } catch (error) {
    next(error);
  }
};
export const update = async (
  req: Request<any, {}, TUpdateZoneInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const species = await zoneService.update(
      req.params.id as unknown as TId,
      req.body,
    );
    return res.status(200).json(species);
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
    await zoneService.remove(req.params.id as unknown as TId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
