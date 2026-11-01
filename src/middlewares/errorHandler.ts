import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/client";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error.stack);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erreur de validation Zod",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return res.status(409).json({
          error: "Erreur de Prisma Known Request Errors",
          message: "Un enregistrement avec cette valeur existe déjà.",
          fields: error.meta?.target,
        });
      case "P2003":
        return res.status(400).json({
          error: "Erreur de Prisma Known Request Errors",
          message: "Contrainte de foreign key violée.",
          fields: error.meta?.target,
        });
      case "P2025":
        return res.status(404).json({
          error: "Erreur de Prisma Known Request Errors",
          message: "Enregistrement non trouvé.",
          fields: error.meta?.target,
        });
      default:
        return res.status(400).json({
          error: "Erreur de Prisma Known Request Errors",
          message: `Erreur de base de données (${error.code}).`,
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Erreur de Validation Prisma",
      message: "Données de requête invalides pour la base de données.",
    });
  }

  // if AppError
  // if (error.statusCode) {
  //   return res.status(error.statusCode).json({
  //     message: error.message,
  //     statusCode: error.statusCode,
  //   });
  // }

  return res.status(500).json({ message: "Erreur interne du serveur" });
};

export default errorHandler;
