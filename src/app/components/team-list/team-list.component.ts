import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { Team, TeamPokemon } from 'src/app/models/team-type';
import { TeamService } from 'src/app/team.service';
import { BattleRound, BattlePokemon, TeamData } from '../battle-scene/battle-scene.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  constructor(private teamService: TeamService, private gameService: GameService) {}
  
  // Battle state
  showBattleScene: boolean = false;
  battleRounds: BattleRound[] = [];
  team1: TeamData | null = null;
  team2: TeamData | null = null;
  selectedTeams: string[] = [];
  teamList: Team[] = [];
  isLoading: boolean = false;
  winnerTeamId: string | null = null;
  selectTeam(teamId: string): void {
    const index = this.selectedTeams.indexOf(teamId);
    if (index !== -1) {
      // Deselect
      this.selectedTeams.splice(index, 1);
    } else if (this.selectedTeams.length < 2) {
      // Select up to 2 teams
      this.selectedTeams.push(teamId);
    }
  }
  
  startGame() {
    if (this.selectedTeams.length === 2) { 
      this.isLoading = true;
      this.showBattleScene = false;
      
      const [team1Id, team2Id] = this.selectedTeams;
      const team1 = this.teamList.find(t => t.id === team1Id);
      const team2 = this.teamList.find(t => t.id === team2Id);
      
      if (!team1 || !team2) {
        console.error('One or both teams not found');
        this.isLoading = false;
        return;
      }
      
      // Prepare teams data for battle scene
      this.prepareTeamsForBattle(team1, team2);
      
      console.log('Starting battle between:', team1.name, 'and', team2.name);
      
      // Start the actual game
      this.gameService.startGame({ teamOne: team1Id, teamTwo: team2Id }).subscribe({
        next: (response: any) => {
          console.log('Battle response:', response);
          if (response && Array.isArray(response.rounds)) {
            this.battleRounds = this.processBattleRounds(response.rounds);
            this.winnerTeamId = response.winner_team_id;
            this.showBattleScene = true;
            console.log('Battle rounds processed:', this.battleRounds);
          } else {
            console.error('Invalid battle response format:', response);
          }
        },
        error: (err) => {
          console.error('Error starting game:', err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
          console.log('Battle completed');
        }
      });
    } else {
      console.error('Please select exactly 2 teams to start the game.');
    }
  }
  
  private prepareTeamsForBattle(team1: Team, team2: Team): void {
    // Create a copy of the teams with initial life values
    this.team1 = {
      id: team1.id,
      name: team1.name,
      pokemons: team1.pokemons.map(p => ({
        id: p.id,
        name: p.name,
        life: p.life,
        life_before: p.life,
        life_after: p.life,
        power: p.power || 0,
        type: p.type || 'normal',
        image: p.image || 'assets/default-pokemon.png'
      }))
    };
    
    this.team2 = {
      id: team2.id,
      name: team2.name,
      pokemons: team2.pokemons.map(p => ({
        id: p.id,
        name: p.name,
        life: p.life,
        life_before: p.life,
        life_after: p.life,
        power: p.power || 0,
        type: p.type || 'normal',
        image: p.image || 'assets/default-pokemon.png'
      }))
    };
  }
  
  private processBattleRounds(rounds: any[]): BattleRound[] {
    if (!Array.isArray(rounds)) {
      console.error('Invalid rounds data:', rounds);
      return [];
    }

    const result: BattleRound[] = [];
    
    for (const round of rounds) {
      try {
        if (!round || typeof round !== 'object') {
          console.warn('Invalid round data:', round);
          continue;
        }

        // Ensure we have valid pokemon data
        const team1Pokemon = round.team1_pokemon || {};
        const team2Pokemon = round.team2_pokemon || {};

        // Find the original pokemon data to get their full details
        const team1Original = this.team1?.pokemons?.find(p => p.id === team1Pokemon.id);
        const team2Original = this.team2?.pokemons?.find(p => p.id === team2Pokemon.id);

        // Create the battle round with proper typing
        const battleRound: BattleRound = {
          round: round.round || 0,
          team1_pokemon: {
            id: team1Pokemon.id || '',
            name: team1Pokemon.name || 'Unknown',
            life: team1Pokemon.life_before || 0,
            life_before: team1Pokemon.life_before || 0,
            life_after: team1Pokemon.life_after ?? 0,
            power: team1Original?.power || 0,
            type: team1Original?.type || 'normal',
            image: team1Original?.image || 'assets/default-pokemon.png'
          },
          team2_pokemon: {
            id: team2Pokemon.id || '',
            name: team2Pokemon.name || 'Unknown',
            life: team2Pokemon.life_before || 0,
            life_before: team2Pokemon.life_before || 0,
            life_after: team2Pokemon.life_after ?? 0,
            power: team2Original?.power || 0,
            type: team2Original?.type || 'normal',
            image: team2Original?.image || 'assets/default-pokemon.png'
          },
          logs: round.logs || []
        };
        
        result.push(battleRound);
      } catch (error) {
        console.error('Error processing round:', error, round);
      }
    }
    
    return result;
  }
  
  ngOnInit(){
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        console.log("teams", teams)
       this.teamList = teams;
      },
      error: (err) => {
        console.error('Error fetching teams:', err);
      }
    });
  }

  onBattleEnded(winner: string): void {
    console.log(`Battle ended. Winner: ${winner}`);
    // You can add any additional logic here when the battle ends
  }
}
