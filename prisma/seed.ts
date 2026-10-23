import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProtectionStatus,
  SpeciesType,
  ZoneType,
} from "../src/generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.observation.deleteMany();
  await prisma.species.deleteMany();
  await prisma.zone.deleteMany();

  const veneon = await prisma.zone.create({
    data: {
      name: "Vallée du Vénéon",
      type: ZoneType.VALLÉE,
      altitude: 1200,
      description: "Vallée glaciaire encaissée.",
    },
  });

  const emparis = await prisma.zone.create({
    data: {
      name: "Plateau d'Emparis",
      type: ZoneType.PRAIRIE,
      altitude: 2400,
      description: "Vaste plateau herbeux avec vue panoramique.",
    },
  });

  const lauvitel = await prisma.zone.create({
    data: {
      name: "Lac du Lauvitel",
      type: ZoneType.LAC,
      altitude: 1530,
      description: "Le plus grand lac des Écrins.",
    },
  });

  const berarde = await prisma.zone.create({
    data: {
      name: "Forêt de la Bérarde",
      type: ZoneType.FORÊT,
      altitude: 1700,
      description: "Zone boisée alpine de montagne.",
    },
  });

  const bouquetin = await prisma.species.create({
    data: {
      commonName: "Bouquetin des Alpes",
      scientificName: "Capra ibex",
      type: SpeciesType.MAMMIFÈRE,
      protectionStatus: ProtectionStatus.LC,
      zones: { connect: [{ id: emparis.id }, { id: veneon.id }] },
    },
  });

  const aigle = await prisma.species.create({
    data: {
      commonName: "Aigle royal",
      scientificName: "Aquila chrysaetos",
      type: SpeciesType.OISEAU,
      protectionStatus: ProtectionStatus.LC,
      zones: { connect: [{ id: veneon.id }, { id: emparis.id }] },
    },
  });

  const lagopede = await prisma.species.create({
    data: {
      commonName: "Lagopède alpin",
      scientificName: "Lagopus muta",
      type: SpeciesType.OISEAU,
      protectionStatus: ProtectionStatus.VU,
      zones: { connect: [{ id: emparis.id }, { id: berarde.id }] },
    },
  });

  const vipere = await prisma.species.create({
    data: {
      commonName: "Vipère aspic",
      scientificName: "Vipera aspis",
      type: SpeciesType.REPTILE,
      protectionStatus: ProtectionStatus.LC,
      zones: { connect: [{ id: berarde.id }, { id: lauvitel.id }] },
    },
  });

  const apollon = await prisma.species.create({
    data: {
      commonName: "Apollon",
      scientificName: "Parnassius apollo",
      type: SpeciesType.INSECTE,
      protectionStatus: ProtectionStatus.VU,
      zones: { connect: [{ id: emparis.id }, { id: lauvitel.id }] },
    },
  });

  const genepi = await prisma.species.create({
    data: {
      commonName: "Génépi",
      scientificName: "Artemisia genipi",
      type: SpeciesType.PLANTE,
      protectionStatus: ProtectionStatus.NT,
      zones: { connect: [{ id: emparis.id }, { id: berarde.id }] },
    },
  });

  await prisma.observation.createMany({
    data: [
      {
        quantity: 5,
        notes: "Groupe au repos au soleil.",
        speciesId: bouquetin.id,
        zoneId: emparis.id,
      },
      {
        quantity: 1,
        notes: "En vol circulaire au-dessus des crêtes.",
        speciesId: aigle.id,
        zoneId: veneon.id,
      },
      {
        quantity: 2,
        notes: "Plumage en transition.",
        speciesId: lagopede.id,
        zoneId: emparis.id,
      },
      {
        quantity: 1,
        notes: "Inactif sur une pierre chaude.",
        speciesId: vipere.id,
        zoneId: berarde.id,
      },
      {
        quantity: 4,
        notes: "Vol plané caractéristique près de l’eau.",
        speciesId: apollon.id,
        zoneId: lauvitel.id,
      },
      {
        quantity: 12,
        notes: "Belle touffe fleurie dans les éboulis.",
        speciesId: genepi.id,
        zoneId: emparis.id,
      },
      {
        quantity: 3,
        notes: "Femelles et petits broutant.",
        speciesId: bouquetin.id,
        zoneId: veneon.id,
      },
      {
        quantity: 2,
        notes: "Couple repéré en phase de chasse.",
        speciesId: aigle.id,
        zoneId: emparis.id,
      },
    ],
  });
  console.log("✅ Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
