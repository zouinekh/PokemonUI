import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { FormsModule } from '@angular/forms';
import { TeamListComponent } from './components/team-list/team-list.component';
import { StartGameComponent } from './components/start-game/start-game.component';


export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    PokemonListComponent,
    CreateTeamComponent,
    TeamListComponent,
    StartGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
