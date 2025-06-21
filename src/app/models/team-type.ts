export interface Team {
    id: string;
    name: string;
    description: string;
    pokemons: number[]; // Array of Pokémon IDs
    createdAt: string;
  }