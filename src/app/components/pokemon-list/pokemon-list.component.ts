import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Pokemon, PokemonApiResponse } from "../../models/pokemon-type";
import {Modal} from "bootstrap"
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('600ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('600ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  selectedPokemons: string[] = [];
  isLoadingData = true;
  editingPokemon: Pokemon | null = null;
  private editModal: Modal | undefined;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    const savedSelections = localStorage.getItem('selectedPokemons');
    this.selectedPokemons = savedSelections ? JSON.parse(savedSelections) : [];

    this.http.get<PokemonApiResponse>('http://localhost:3000/pokemons').subscribe({
      next: (data) => {
        this.pokemons = data.results.map(pokemon => ({
          ...pokemon,
          selected: this.selectedPokemons.includes(pokemon.id)
        }));
        this.isLoadingData = false;
      },
      error: () => {
        console.error('Error fetching Pokémon');
        this.isLoadingData = false;
     
      }
    });

    // Initialize modal after view init
    setTimeout(() => {
      const modalElement = document.getElementById('editPokemonModal');
      if (modalElement) {
        this.editModal = new Modal(modalElement);
      }
    });
  }

  createTeam(){
    this.router.navigate(["/create-team"])
  }

  togglePokemonSelection(pokemon: Pokemon) {
    pokemon.selected = !pokemon.selected;
    if (pokemon.selected) {
      this.selectedPokemons.push(pokemon.id);
    } else {
      this.selectedPokemons = this.selectedPokemons.filter(id => id !== pokemon.id);
    }
    localStorage.setItem('selectedPokemons', JSON.stringify(this.selectedPokemons));
  }

  getPokemonName(id: string): string {
    const pokemon = this.pokemons.find(p => p.id === id);
    return pokemon ? pokemon.name : 'Unknown';
  }

  openEditModal(pokemon: Pokemon) {
    this.editingPokemon = { ...pokemon }; // Create a copy to edit
    this.editModal?.show();
  }

  updatePokemon() {
    if (!this.editingPokemon) return;

    // Find the original pokemon and update it
    const index = this.pokemons.findIndex(p => p.id === this.editingPokemon?.id);
    if (index !== -1) {
      this.pokemons[index] = { ...this.editingPokemon };
      
      // Here you would typically make an HTTP PUT request to your backend
      // this.http.put(`http://localhost:3000/pokemons/${this.editingPokemon.id}`, this.editingPokemon)
      //   .subscribe(response => {
      //     console.log('Pokemon updated', response);
      //   });
    }

    this.editModal?.hide();
  }

  navigateToTeamList(): void {
    this.router.navigate(['/start']);
  }
}