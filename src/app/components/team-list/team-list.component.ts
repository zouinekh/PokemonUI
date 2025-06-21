import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { Team } from 'src/app/models/team-type';
import { TeamService } from 'src/app/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent {
constructor(private teamService:TeamService, private gameService:GameService){}
  teamList: Team[] = []

  selectedTeams: string[] = [];

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
  

  startGame(){
    if (this.selectedTeams.length === 2) { 
      const [teamOne, teamTwo] = this.selectedTeams;
      this.gameService.startGame({ teamOne, teamTwo }).subscribe({
        next: (result) => {
          console.log('Game started successfully:', result);
          // You can navigate to the game result page or display the result here
        },
        error: (err) => {
          console.error('Error starting game:', err);
        }
      });
      this.selectedTeams = []; // Reset selected teams after starting the game
    } else {
      console.error('Please select exactly 2 teams to start the game.');
    }
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
}
