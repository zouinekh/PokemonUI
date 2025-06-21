import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';

import { PokemonType } from 'src/app/models/pokemon-type';

export interface BattlePokemon {
  id: string;
  name: string;
  life?: number;
  life_before: number;
  life_after: number;
  power?: number;
  type?: PokemonType | string;
  image?: string;
}

export interface BattleRound {
  round: number;
  team1_pokemon: BattlePokemon;
  team2_pokemon: BattlePokemon;
  logs?: string[];
}

export interface BattleResult {
  winner_team_id: string;
  rounds: BattleRound[];
}

export interface TeamData {
  id: string;
  name: string;
  pokemons: BattlePokemon[];
}

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.css']
})
export class BattleSceneComponent implements OnChanges, OnInit {
  @Input() set battleRounds(value: BattleRound[]) {
    this._battleRounds = value || [];
    if (this._battleRounds.length > 0) {
      this.currentRound = 0;
      this.playNextRound();
    }
  }
  get battleRounds(): BattleRound[] {
    return this._battleRounds;
  }
  private _battleRounds: BattleRound[] = [];
  
  @Input() team1: TeamData | null = null;
  @Input() team2: TeamData | null = null;
  
  currentRound: number = 0;
  currentBattle: BattleRound | null = null;
  battleInProgress: boolean = false;
  battleEnded: boolean = false;
  winner: string | null = null;

  ngOnInit(): void {
    // Initialize component if battleRounds are already available
    if (this.battleRounds && this.battleRounds.length > 0 && !this.battleInProgress && !this.battleEnded) {
      this.startBattle();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['battleRounds'] && this.battleRounds && this.battleRounds.length > 0) {
      // Reset battle state when new battle rounds are received
      this.battleInProgress = false;
      this.battleEnded = false;
      this.currentRound = 0;
      this.currentBattle = null;
      this.winner = null;
      
      // Start the battle after a short delay to ensure UI updates
      setTimeout(() => {
        this.startBattle();
      }, 100);
    }
  }

  startBattle(): void {
    if (!this.battleRounds || this.battleRounds.length === 0) {
      console.error('No battle rounds available');
      return;
    }
    
    this.battleInProgress = true;
    this.battleEnded = false;
    this.currentRound = 0;
    this.playNextRound();
  }

  playNextRound(): void {
    if (!this.battleRounds || this.currentRound >= this.battleRounds.length) {
      // All rounds completed, determine winner
      this.determineWinner();
      return;
    }

    // Get current round data
    const currentRound = this.battleRounds[this.currentRound];
    if (!currentRound) {
      console.error('Invalid round data');
      return;
    }

    this.currentBattle = currentRound;
    this.currentRound++;

    // Update team data with latest life values
    if (this.team1?.pokemons && currentRound.team1_pokemon) {
      const pokemon1 = this.team1.pokemons.find(p => p.id === currentRound.team1_pokemon.id);
      if (pokemon1 && currentRound.team1_pokemon) {
        pokemon1.life_after = currentRound.team1_pokemon.life_after;
      }
    }

    if (this.team2?.pokemons && currentRound.team2_pokemon) {
      const pokemon2 = this.team2.pokemons.find(p => p.id === currentRound.team2_pokemon.id);
      if (pokemon2 && currentRound.team2_pokemon) {
        pokemon2.life_after = currentRound.team2_pokemon.life_after;
      }
    }

    // Check if battle should end
    const team1Alive = this.team1?.pokemons?.some(p => p.life_after > 0) ?? false;
    const team2Alive = this.team2?.pokemons?.some(p => p.life_after > 0) ?? false;

    if (!team1Alive || !team2Alive) {
      this.endBattle(!team1Alive ? (this.team2?.name || 'Team 2') : (this.team1?.name || 'Team 1'));
      return;
    }

    // Continue to next round
    setTimeout(() => this.playNextRound(), 2000);
  }

  @Input() winnerTeamId: string | null = null;
  @Output() battleEndedEvent = new EventEmitter<string>();
  
  private determineWinner(): void {
    if (!this.team1 || !this.team2) {
      console.error('Teams not available to determine winner');
      return;
    }
    
    // Use the winner_team_id from the backend if available
    if (this.winnerTeamId) {
      this.winner = this.winnerTeamId === this.team1.id ? this.team1.name : this.team2.name;
    } else {
      // Fallback to counting remaining pokemon if no winner_team_id is provided
      const team1Remaining = this.team1.pokemons.filter(p => (p.life_after || 0) > 0).length;
      const team2Remaining = this.team2.pokemons.filter(p => (p.life_after || 0) > 0).length;
      
      if (team1Remaining > 0 && team2Remaining === 0) {
        this.winner = this.team1.name;
      } else if (team2Remaining > 0 && team1Remaining === 0) {
        this.winner = this.team2.name;
      } else {
        this.winner = 'Draw';
      }
    }
    
    this.battleInProgress = false;
    this.battleEnded = true;
  }

  endBattle(winner: string): void {
    this.battleInProgress = false;
    this.battleEnded = true;
    this.winner = winner;
    this.battleEndedEvent.emit(winner);
  }

  // Helper methods for template
  getHealthPercentage(pokemon: BattlePokemon): number {
    if (!pokemon) return 0;
    const current = pokemon.life_after || 0;
    const max = pokemon.life || pokemon.life_before || 100; // Fallback to 100 if no max life is set
    return max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  }

  getCurrentLife(pokemon: BattlePokemon): number {
    return pokemon?.life_after ?? 0;
  }

  getMaxLife(pokemon: BattlePokemon): number {
    return pokemon?.life ?? pokemon?.life_before ?? 0;
  }

  getPokemonImage(pokemon: BattlePokemon): string {
    return pokemon?.image || 'assets/default-pokemon.png';
  }
}
