import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import prisma from "../src/config/database";
import {
  ProtectionStatus,
  SpeciesType,
  ZoneType,
} from "../src/generated/enums";

const app = (await import("../src/server")).default;

describe("Observation Routes (Integration)", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    // Disconnect after all tests finish
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up tables between tests and reset auto-increment IDs
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE "Observation", "Species", "Zone" RESTART IDENTITY CASCADE;
    `);
  });

  describe("GET /api/observations", () => {
    it("should return 200 and a paginated list of observations", async () => {
      // 1. Seed a Zone and a Species first
      const zone = await prisma.zone.create({
        data: {
          name: "Vallée du Vénéon",
          type: ZoneType.VALLÉE,
          altitude: 1200,
          description: "Vallée glaciaire encaissée.",
        },
      });
      const species = await prisma.species.create({
        data: {
          commonName: "Bouquetin des Alpes",
          scientificName: "Capra ibex",
          type: SpeciesType.MAMMIFÈRE,
          protectionStatus: ProtectionStatus.LC,
          zones: { connect: [{ id: zone.id }] },
        },
      });
      console.log("ZONEE", zone.id);

      // 2. Seed an observation linked to them
      await prisma.observation.create({
        data: {
          quantity: 2,
          notes: "Aigle vu",
          zoneId: zone.id,
          speciesId: species.id,
        },
      });

      const response = await request(app).get(
        "/api/observations?page=1&perPage=5",
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveLength(1);
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.pagination.total).toBe(1);
    });

    it("should return 400 if query validation fails (e.g., negative page)", async () => {
      const response = await request(app).get("/api/observations?page=-1");

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/observations/:id", () => {
    it("should return 200 and the observation if found", async () => {
      // Seed required relations and observation
      const zone = await prisma.zone.create({
        data: {
          name: "Vallée du Vénéon",
          type: ZoneType.VALLÉE,
          altitude: 1200,
          description: "Vallée glaciaire encaissée.",
        },
      });
      const species = await prisma.species.create({
        data: {
          commonName: "Bouquetin des Alpes",
          scientificName: "Capra ibex",
          type: SpeciesType.MAMMIFÈRE,
          protectionStatus: ProtectionStatus.LC,
          zones: { connect: [{ id: zone.id }] },
        },
      });

      const observation = await prisma.observation.create({
        data: {
          quantity: 3,
          notes: "Test note",
          zoneId: zone.id,
          speciesId: species.id,
        },
      });

      const response = await request(app).get(
        `/api/observations/${observation.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(observation.id);
    });
  });

  describe("POST /api/observations", () => {
    it("should return 201 and create an observation when payload is valid", async () => {
      // Seed required relations so foreign keys exist in the database
      const zone = await prisma.zone.create({
        data: {
          name: "Vallée du Vénéon",
          type: ZoneType.VALLÉE,
          altitude: 1200,
          description: "Vallée glaciaire encaissée.",
        },
      });
      const species = await prisma.species.create({
        data: {
          commonName: "Bouquetin des Alpes",
          scientificName: "Capra ibex",
          type: SpeciesType.MAMMIFÈRE,
          protectionStatus: ProtectionStatus.LC,
          zones: { connect: [{ id: zone.id }] },
        },
      });

      const newObservationPayload = {
        quantity: 2,
        notes: "Belle observation",
        speciesId: species.id,
        zoneId: zone.id,
      };

      const response = await request(app)
        .post("/api/observations")
        .send(newObservationPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.quantity).toBe(2);

      // Verify it was written to the PostgreSQL database
      const count = await prisma.observation.count();
      expect(count).toBe(1);
    });

    it("should return 400 if required fields are missing", async () => {
      const invalidPayload = {
        quantity: -1, // Invalid quantity (must be >= 1)
      };

      const response = await request(app)
        .post("/api/observations")
        .send(invalidPayload);

      expect(response.status).toBe(400);

      // Verify nothing was saved to the database
      const count = await prisma.observation.count();
      expect(count).toBe(0);
    });
  });

  describe("DELETE /api/observations/:id", () => {
    it("should return 204 when observation is successfully deleted", async () => {
      // Seed required relations and observation to delete
      const zone = await prisma.zone.create({
        data: {
          name: "Vallée du Vénéon",
          type: ZoneType.VALLÉE,
          altitude: 1200,
          description: "Vallée glaciaire encaissée.",
        },
      });
      const species = await prisma.species.create({
        data: {
          commonName: "Bouquetin des Alpes",
          scientificName: "Capra ibex",
          type: SpeciesType.MAMMIFÈRE,
          protectionStatus: ProtectionStatus.LC,
          zones: { connect: [{ id: zone.id }] },
        },
      });

      const observation = await prisma.observation.create({
        data: {
          quantity: 1,
          zoneId: zone.id,
          speciesId: species.id,
        },
      });

      const response = await request(app).delete(
        `/api/observations/${observation.id}`,
      );

      expect(response.status).toBe(204);

      // Verify it was deleted from PostgreSQL
      const found = await prisma.observation.findUnique({
        where: { id: observation.id },
      });
      expect(found).toBeNull();
    });
  });
});
