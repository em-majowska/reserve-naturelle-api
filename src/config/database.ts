import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client";

if (process.env.NODE_ENV !== "test") {
  await import("dotenv/config");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default prisma;
