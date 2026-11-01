import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { mockPrisma } from "./mockPrisma";
import { TObservation } from "../src/types";
import { Prisma } from "../src/generated/client";
import { NextFunction, Request, Response } from "express";

jest.unstable_mockModule("../src/services/observationService", () => ({
  getAllObservations: jest.fn(),
  getObservationById: jest.fn(),
  createObservation: jest.fn(),
  removeObservation: jest.fn(),
}));

const observationService = await import("../src/services/observationService");
const observationController =
  await import("../src/controllers/observationController");

const mockRequest = (overrides: Partial<Request> = {}): Request => {
  return {
    params: {},
    body: {},
    query: {},
    ...overrides,
  } as Request;
};

const mockResponse = (): Response => {
  const res = {} as any;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const mockNext: NextFunction = jest.fn();

const fakeObservations: TObservation[] = [
  {
    id: 8,
    quantity: 2,
    notes: "Couple repéré en phase de chasse.",
    observedAt: new Date(),
    zone: {
      name: "Plateau d'Emparis",
    },
    species: {
      commonName: "Aigle royal",
    },
  },
  {
    id: 5,
    quantity: 4,
    notes: "Vol plané caractéristique près de l’eau.",
    observedAt: new Date(),
    zone: {
      name: "Lac du Lauvitel",
    },
    species: {
      commonName: "Apollon",
    },
  },
];

const prismaError = new Prisma.PrismaClientKnownRequestError(
  "No 'Observation' record found for a unique constraint.",
  {
    code: "P2025",
    clientVersion: "5.0.0",
    meta: { target: ["id"] },
  },
);

describe("observationController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call res.json with array of observations", async () => {
    jest.mocked(observationService.getAllObservations).mockResolvedValue({
      data: fakeObservations,
      pagination: {
        page: 1,
        perPage: 20,
        total: fakeObservations.length,
        totalPages: 1,
      },
    });

    const req = mockRequest();
    const res = mockResponse();

    await observationController.getAll(req, res, mockNext);

    expect(observationService.getAllObservations).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: fakeObservations,
      pagination: {
        page: 1,
        perPage: 20,
        total: fakeObservations.length,
        totalPages: 1,
      },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return status 200 with the observation", async () => {
    jest
      .mocked(observationService.getObservationById)
      .mockResolvedValue(fakeObservations[0]);

    const req = mockRequest();
    const res = mockResponse();

    await observationController.getById(req, res, mockNext);

    expect(observationService.getObservationById).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeObservations[0]);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return status 404 if observation is not found", async () => {
    jest
      .mocked(observationService.getObservationById)
      .mockRejectedValue(prismaError);

    const req = mockRequest({ params: { id: "999" } });
    const res = mockResponse();

    await observationController.getById(req, res, mockNext);

    expect(observationService.getObservationById).toHaveBeenCalledWith(999);
    expect(observationService.getObservationById).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(prismaError);
  });

  it("should return status 201 with created observation", async () => {
    const fakeData = {
      id: 11,
      quantity: 2,
      notes: "Couple repéré en phase de chasse.",
      observedAt: new Date(),
      zoneId: 1,
      speciesId: 1,
    };

    jest
      .mocked(observationService.createObservation)
      .mockResolvedValue(fakeData);

    const req = mockRequest({ body: fakeData });
    const res = mockResponse();

    await observationController.create(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(observationService.createObservation).toHaveBeenCalledWith(fakeData);
    expect(observationService.createObservation).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 2 }),
    );
  });

  it("should throw a Prisma P2003 foreign key constraint error", async () => {
    const fakeData = {
      quantity: 2,
      notes: "Couple repéré en phase de chasse.",
      observedAt: "2026-10-23T09:26:45.706Z",
      zoneId: 999,
      speciesId: 1,
    };
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "Foreign key constraint failed on the field: `zoneId`",
      {
        code: "P2003",
        clientVersion: "5.0.0",
        meta: { target: ["zoneId"] },
      },
    );

    jest
      .mocked(observationService.createObservation)
      .mockRejectedValue(prismaError);

    const req = mockRequest({ body: fakeData });
    const res = mockResponse();

    await observationController.create(req, res, mockNext);

    expect(res.status).not.toHaveBeenCalled();
    expect(observationService.createObservation).toHaveBeenCalledWith(fakeData);
    expect(observationService.createObservation).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(prismaError);
  });

  it("should return status 204 if observation was deleted", async () => {
    jest.mocked(observationService.removeObservation).mockResolvedValue(null);
    const req = mockRequest({ params: { id: "1" } });
    const res = mockResponse();

    await observationController.remove(req as any, res, mockNext);
    expect(observationService.removeObservation).toHaveBeenCalledWith(1);
    expect(observationService.removeObservation).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should return status 404 if observation to delete is not found", async () => {
    jest
      .mocked(observationService.removeObservation)
      .mockRejectedValue(prismaError);
    const req = mockRequest({ params: { id: "999" } });
    const res = mockResponse();

    await observationController.remove(req as any, res, mockNext);
    expect(observationService.removeObservation).toHaveBeenCalledWith(999);
    expect(observationService.removeObservation).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(prismaError);
  });
});
