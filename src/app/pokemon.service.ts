import { Injectable } from '@angular/core';
import { Pokemon, PokemonApiResponse } from './models/pokemon-type';
import {Team} from "./models/team-type"
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly SELECTED_KEY = 'selectedPokemons';
  private readonly TEAMS_KEY = 'pokemonTeams';

  constructor(private http:HttpClient) {}

  // Selected Pokémons Management
  getSelectedPokemons(): number[] {
    const savedSelections = localStorage.getItem(this.SELECTED_KEY);
    return savedSelections ? JSON.parse(savedSelections) : [];
  }
 
  saveSelectedPokemons(pokemonIds: number[]): void {
    localStorage.setItem(this.SELECTED_KEY, JSON.stringify(pokemonIds));
  }

  addToSelected(pokemonId: number): void {
    const current = this.getSelectedPokemons();
    if (!current.includes(pokemonId) && current.length < 6) {
      current.push(pokemonId);
      this.saveSelectedPokemons(current);
    }
  }
  
  removeFromSelected(pokemonId: number): void {
    const current = this.getSelectedPokemons();
    this.saveSelectedPokemons(current.filter(id => id !== pokemonId));
  }

  clearSelected(): void {
    localStorage.removeItem(this.SELECTED_KEY);
  }

  // Team Management
  getTeams(): Team[] {
    const savedTeams = localStorage.getItem(this.TEAMS_KEY);
    return savedTeams ? JSON.parse(savedTeams) : [];
  }

  getTeam(id: string): Team | undefined {
    const teams = this.getTeams();
    return teams.find(team => team.id === id);
  }

  saveTeam(teamData: Omit<Team, 'id'>): Team {
    const teams = this.getTeams();
    const newTeam = {
      ...teamData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    teams.push(newTeam);
    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(teams));
    this.clearSelected(); // Clear selection after saving
    return newTeam;
  }

  updateTeam(id: string, teamData: Partial<Team>): Team | undefined {
    const teams = this.getTeams();
    const index = teams.findIndex(team => team.id === id);
    
    if (index !== -1) {
      const updatedTeam = { ...teams[index], ...teamData };
      teams[index] = updatedTeam;
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify(teams));
      return updatedTeam;
    }
    return undefined;
  }

  deleteTeam(id: string): void {
    const teams = this.getTeams().filter(team => team.id !== id);
    localStorage.setItem(this.TEAMS_KEY, JSON.stringify(teams));
  }

  // Helper Methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
  getPokemonDetails(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`http://localhost:3000/pokemons/${id}`).pipe(
      tap(response => console.log('API Response:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => new Error(
          `Failed to fetch Pokémon (Status: ${error.status} - ${error.message})`
        ));
      })
    );
  }
}