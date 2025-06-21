export interface PokemonType {
  id: string;
  name: string;
}

export interface Pokemon {
  id: string;
  name: string;
  type: PokemonType;
  image: string;
  power: number;
  life: number;
  created_at: string;
  updated_at: string;
  selected?: boolean;
}

export interface PokemonApiResponse {
  total: number;
  page: number;
  pageSize: number;
  results: Pokemon[];
}