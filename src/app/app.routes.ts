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
import {AggregatedSotyComponent} from "./songs-of-the-week/aggregated-soty/aggregated-soty.component";
import {SotwAggregateResolverService} from "./services/sotw-aggregate.resolver.service";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: 'sotw/:week', component: SongsOfTheWeekComponent, resolve: [SotwItemResolverService, SotwResolverService, AotyResolverService] },
  { path: 'aoty/:year', component: AlbumsOfTheYearComponent, resolve: [AotyItemResolverService, SotwResolverService, AotyResolverService] },
  { path: 'soty/:year', component: AggregatedSotyComponent, resolve: [SotwResolverService, AotyResolverService, SotwAggregateResolverService] },
  { path: 'aoty-decade/:decade', component: AggregatedDecadeComponent, resolve: [AotyResolverService, SotwResolverService, AotyAggregateResolverService] },
  { path: 'error/404', component: NotFoundComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' },
];
