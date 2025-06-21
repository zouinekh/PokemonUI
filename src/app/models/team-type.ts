export interface PokemonType {
  id: string;
  name: string;
}

export interface TeamPokemon {
  id: string;
  name: string;
  image: string;
  power: number;
  life: number;
  type: PokemonType;
  position: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  power?: number; // Optionnel si tu veux calculer la somme
  pokemons: TeamPokemon[]; // Liste complète avec détails
}
