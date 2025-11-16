
export interface iNatTaxon {
  id: number;
  name: string;
  preferred_common_name: string;
  default_photo: {
    square_url: string;
  } | null;
  wikipedia_url: string | null;
}

export interface iNatObservation {
  id: number;
  taxon: iNatTaxon;
  user: {
    login: string;
  };
}

export interface SpeciesObservationStats {
  taxon: iNatTaxon;
  totalObservations: number;
  userObservations: number;
}

export interface RarestSpecies extends SpeciesObservationStats {
  funFact: string;
}
