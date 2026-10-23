import { TId } from "../const";
import { ProtectionStatus, SpeciesType, ZoneType } from "../generated/enums";

export type TZone = {
  id: TId;
  name: string;
  type: ZoneType;
  altitude: number | null;
  description: string | null;
  createdAt: Date;
};

export type TSpecies = {
  id: TId;
  commonName: string;
  scientificName: string;
  type: SpeciesType;
  protectionStatus: ProtectionStatus;
  createdAt: Date;
};

export type TObservation = {
  id: TId;
  quantity: number;
  notes: string | null;
  observedAt: Date;
  zone: Pick<TZone, "name">;
  species: Pick<TSpecies, "commonName">;
};

export type TGetAllObservations = {
  data: TObservation[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};
