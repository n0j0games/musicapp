import { Routes } from '@angular/router';
import {SongsOfTheWeekComponent} from "./songs-of-the-week/songs-of-the-week.component";
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {SotwResolverService} from "./services/sotw-resolver.service";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService] },
  { path: 'sotw/:week', component: SongsOfTheWeekComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
];
