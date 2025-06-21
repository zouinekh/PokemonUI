import { Team } from './models/team-type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http:HttpClient) {}
  
  
  getAllTeams() : Observable<Team[]> {
    return this.http.get<Team[]>('http://localhost:3000/teams');
  } 
  
}

