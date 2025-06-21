import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';

const routes: Routes = [
  { path: 'select-pokemon', component: PokemonListComponent },
  { path: 'create-team', component: CreateTeamComponent },
  { path: '', redirectTo: '/select-pokemon', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }