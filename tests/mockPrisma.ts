import { jest } from "@jest/globals";

export const mockPrisma = {
  observation: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  species: {
    findUnique: jest.fn(),
  },
  zone: {
    findUnique: jest.fn(),
  },
};
