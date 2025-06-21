import { Team } from './models/team-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http:HttpClient) {}
  
  startGame({teamOne,teamTwo} : {teamOne:string, teamTwo:string}): Observable<any> {
    return this.http.post<any>('http://localhost:3000/simulate', { team1_id:teamOne, team2_id: teamTwo });

  }
}

