import { Routes } from '@angular/router';
import {SongsOfTheWeekComponent} from "./songs-of-the-week/songs-of-the-week.component";
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {SotwResolverService} from "./services/sotw-resolver.service";
import {SotwItemResolverService} from "./services/sotw-item.resolver.service";
import {AotyItemResolverService} from "./services/aoty-item.resolver.service";
import {AotyResolverService} from "./services/aoty-resolver.service";
import {AlbumsOfTheYearComponent} from "./albums-of-the-year/albums-of-the-year.component";
import {AggregatedDecadeComponent} from "./albums-of-the-year/aggregated-decade/aggregated-decade.component";
import {AotyAggregateResolverService} from "./services/aoty-aggregate.resolver.service";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: 'sotw/:week', component: SongsOfTheWeekComponent, resolve: [SotwItemResolverService] },
  { path: 'aoty/:year', component: AlbumsOfTheYearComponent, resolve: [AotyItemResolverService] },
  { path: 'aoty-decade/:decade', component: AggregatedDecadeComponent, resolve: [AotyResolverService, AotyAggregateResolverService] },
  { path: '404', component: NotFoundComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
