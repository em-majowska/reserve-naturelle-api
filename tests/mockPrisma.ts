// import { jest } from "@jest/globals";
import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "../src/generated/client";

// manual typing

// export const mockPrisma = {
//   observation: {
//     create: jest.fn<(...args: any[]) => Promise<unknown>>(),
//     findMany: jest.fn(),
//     findUnique: jest.fn(),
//     findUniqueOrThrow: jest.fn(),
//     delete: jest.fn(),
//     count: jest.fn(),
//   },
//   species: {
//     findUnique: jest.fn(),
//   },
//   zone: {
//     findUnique: jest.fn(),
//   },
// };

// with jest-mock-extended

export const mockPrisma = mockDeep<PrismaClient>();
