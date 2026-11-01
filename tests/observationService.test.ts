import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { mockPrisma } from "./mockPrisma";
import { TObservation } from "../src/types";
import { Prisma } from "../src/generated/client";

jest.unstable_mockModule("../src/config/database", () => ({
  default: mockPrisma,
}));

// Import APRÈS le mock (sinon le vrai client est chargé)
const observationService = await import("../src/services/observationService");

describe("observationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("createObservation", () => {
    it("should create an observation", async () => {
      const data = {
        quantity: 2,
        notes: "Test",
        speciesId: 1,
        zoneId: 4,
      };
      const expected = {
        id: 1,
        ...data,
        observedAt: new Date(),
      };

      mockPrisma.observation.create.mockResolvedValue(expected);

      const result = await observationService.createObservation(data);

      expect(mockPrisma.observation.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject(data);
    });

    it("should throw a Prisma validation error when input data is invalid", async () => {
      const validationError = new Prisma.PrismaClientValidationError(
        "Invalid prisma.observation.create() invocation: Missing required field",
        { clientVersion: "5.0.0" },
      );
      const data = {
        notes: "Test",
        speciesId: 1,
        zoneId: 4,
      } as any;

      mockPrisma.observation.create.mockRejectedValue(validationError);

      await expect(observationService.createObservation(data)).rejects.toThrow(
        validationError,
      );

      expect(mockPrisma.observation.create).toHaveBeenCalledTimes(1);
    });
  });

  it("should return a list of observations with pagination data", async () => {
    mockPrisma.observation.findMany.mockResolvedValue([]);
    mockPrisma.observation.count.mockResolvedValue(0);

    const result = await observationService.getAllObservations({
      page: 2,
      perPage: 5,
    });

    expect(mockPrisma.observation.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.observation.count).toHaveBeenCalledTimes(1);
    expect(mockPrisma.observation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
        orderBy: { observedAt: "desc" },
      }),
    );
    expect(result.pagination).toEqual({
      page: 2,
      perPage: 5,
      total: 0,
      totalPages: 0,
    });
  });

  it("should throw a Prisma P2025 error if the observation does not exist", async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "No 'Observation' record found for a unique constraint.",
      {
        code: "P2025",
        clientVersion: "5.0.0",
        meta: { target: ["id"] },
      },
    );
    mockPrisma.observation.findUniqueOrThrow.mockRejectedValue(prismaError);

    await expect(observationService.getObservationById(3)).rejects.toThrow(
      prismaError,
    );

    expect(mockPrisma.observation.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    expect(mockPrisma.observation.findUniqueOrThrow).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 } }),
    );
  });

  describe("removeObservation", () => {
    it("should delete observation of given id", async () => {
      const fakeData = {
        id: 1,
        quantity: 2,
        notes: "Test",
        speciesId: 1,
        zoneId: 4,
        observedAt: new Date(),
      };
      mockPrisma.observation.delete.mockResolvedValue(fakeData);

      const res = await observationService.removeObservation(1);

      expect(mockPrisma.observation.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.observation.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
      expect(res).toEqual(fakeData);
    });

    it("should throw a Prisma P2025 error if the observation does not exist", async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "No 'Observation' record found for a unique constraint.",
        {
          code: "P2025",
          clientVersion: "5.0.0",
          meta: { target: ["id"] },
        },
      );
      mockPrisma.observation.delete.mockRejectedValue(prismaError);

      await expect(observationService.removeObservation(999)).rejects.toThrow(
        prismaError,
      );
      expect(mockPrisma.observation.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.observation.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 999 },
        }),
      );
    });
  });
});
