import { Request, Response, NextFunction } from "express";
import z from "zod";

export const validate = (schema: z.ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(result.error);
    }

    const data = result.data as any;
    if (data.body) req.body = data.body;
    if (data.params) {
      Object.defineProperty(req, "params", {
        value: data.params,
        writable: true,
        configurable: true,
      });
    }

    if (data.query) {
      Object.defineProperty(req, "query", {
        value: data.query,
        writable: true,
        configurable: true,
      });
    }

    next();
  };
};
