import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PlayersComponent } from './players/players.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'players', component: PlayersComponent },
];
