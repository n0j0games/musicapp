import { Routes } from '@angular/router';
import {SongsOfTheWeekComponent} from "./songs-of-the-week/songs-of-the-week.component";
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {SotwResolverService} from "./services/sotw-resolver.service";
import {SotwItemResolverService} from "./services/sotw-item.resolver.service";
import {AotyItemResolverService} from "./services/aoty-item.resolver.service";
import {AotyResolverService} from "./services/aoty-resolver.service";
import {AlbumsOfTheYearComponent} from "./albums-of-the-year/albums-of-the-year.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: 'sotw/:week', component: SongsOfTheWeekComponent, resolve: [SotwItemResolverService] },
  { path: 'aoty/:year', component: AlbumsOfTheYearComponent, resolve: [AotyItemResolverService] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
];
