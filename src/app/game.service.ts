import { Team } from './models/team-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BattleRound } from './components/battle-scene/battle-scene.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http:HttpClient) {}
  
  startGame({teamOne, teamTwo}: {teamOne: string, teamTwo: string}): Observable<BattleRound[]> {
    return this.http.post<BattleRound[]>('http://localhost:3000/battle/simulate', { 
      team1_id: teamOne, 
      team2_id: teamTwo 
    });
  }
}

