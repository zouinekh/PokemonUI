import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/pokemon.service';
import { Pokemon, PokemonApiResponse } from 'src/app/models/pokemon-type';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  selectedPokemons: number[] = [];
  showPokemonSelector = false ;
  currentSlotIndex = 0;
  listOfAllPokemons: Pokemon[] = [] 
  teamPokemons: Pokemon[] = [];
  pokemonDetails: (Pokemon | null)[] = Array(6).fill(null); // Initialize with 6 null slots
  team = {
    name: '',
    description: '',
    pokemons: [] as number[]
  };
  teamList: any[] = []; // Add this if not already present

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.selectedPokemons = this.pokemonService.getSelectedPokemons();
    await this.loadPokemonDetails();
    await this.getAllPokemons()
  }

  async loadPokemonDetails() {
    // Clear previous details
    this.pokemonDetails = Array(6).fill(null);
    
    // Load details only for selected Pokémon
    for (let i = 0; i < this.selectedPokemons.length; i++) {
      if (this.selectedPokemons[i]) {
        try {
          const pokemon = await this.pokemonService.getPokemonDetails(this.selectedPokemons[i]).toPromise();
          this.pokemonDetails[i] = pokemon || null; 
         if(pokemon){
          this.teamPokemons.push(pokemon)
         }
        } catch (error) {
          console.error(`Error loading Pokémon ${this.selectedPokemons[i]}:`, error);
          this.pokemonDetails[i] = null;
        }
      }
    }
  }
  getAllPokemons(){
    this.http.get<PokemonApiResponse>('http://localhost:3000/pokemons').subscribe({
      next: (data) => {
       this.listOfAllPokemons = data.results 
      },
      error: () => {
        console.error('Error fetching Pokémon'); 
      }
    });
  }
  removePokemon(index: number): void {
    this.selectedPokemons.splice(index, 1);
    this.pokemonDetails.splice(index, 1);
    this.pokemonDetails.push(null); // Maintain 6 slots
    this.pokemonService.saveSelectedPokemons(this.selectedPokemons);
  }

  saveTeam(): void {
    console.log(this.team)
    this.team.pokemons = this.selectedPokemons;
    this.team.name = this.team.name.trim();
    this.team.description = this.team.description.trim();

    if (this.team.name && this.team.description && this.pokemonDetails.length > 0) {
      // Save the team to the server or local storage
      console.log('Team saved:', this.team); 
      this.http.post('http://localhost:3000/teams', {team_name:this.team.name,description:this.team.description,pokemon_ids:this.pokemonDetails.map((p) => p?.id)}).subscribe({
        next: (response) => {
          console.log('Team saved successfully:', response);
          alert('Team saved successfully!');
          this.router.navigate(['/start'], { relativeTo: this.route });
        },
        error: (error) => {
          console.error('Error saving team:', error);
          alert('Failed to save team. Please try again.');
        }
      });
    } else {
      alert('Please fill in all fields and select at least one Pokémon.');
    }
  }
  selectPokemon(p:Pokemon | null ){
    if(!p) return ; 
    this.showPokemonSelector = false;
    console.log("current index" , this.currentSlotIndex)
    this.pokemonDetails[this.currentSlotIndex] = p; 
    console.log(this.pokemonDetails)
  }
  showModal(i:number){
    this.currentSlotIndex = i;
    this.showPokemonSelector = true;
  }
  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  navigateToTeamSelection(): void {
    this.router.navigate(['/start']);
  }
}