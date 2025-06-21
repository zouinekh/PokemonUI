import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/pokemon.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  selectedPokemons: number[] = [];
  pokemonDetails: any[] = []; // Changed from pokemonDetails$ to pokemonDetails
  team = {
    name: '',
    description: '',
    pokemons: [] as number[]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  async ngOnInit() {
    // Get selected pokemons from state or service
    const navigation = this.router.getCurrentNavigation();
    this.selectedPokemons = navigation?.extras.state?.['selectedPokemons'] || 
                          this.pokemonService.getSelectedPokemons();
    
    // Load details for each selected Pokémon
    await this.loadPokemonDetails();
  }

  async loadPokemonDetails() {
    this.pokemonDetails = await Promise.all(
      this.selectedPokemons.map(id => 
        this.pokemonService.getPokemonDetails(id).toPromise()
      )
    );
  }

  removePokemon(index: number): void {
    this.selectedPokemons.splice(index, 1);
    this.pokemonDetails.splice(index, 1); // Fixed: Changed pokemonDetails$ to pokemonDetails
    this.pokemonService.saveSelectedPokemons(this.selectedPokemons);
  }

  saveTeam(): void {
    if (this.selectedPokemons.length === 0) return;
    
    this.team.pokemons = [...this.selectedPokemons];
    // Add your team saving logic here
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}