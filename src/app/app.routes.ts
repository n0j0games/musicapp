import { Routes } from '@angular/router';
import {SongsOfTheWeekComponent} from "./songs-of-the-week/songs-of-the-week.component";
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./common/components/not-found/not-found.component";
import {SotwResolverService} from "./common/resolver/sotw-resolver.service";
import {SotwItemResolverService} from "./common/resolver/sotw-item.resolver.service";
import {AotyItemResolverService} from "./common/resolver/aoty-item.resolver.service";
import {AotyResolverService} from "./common/resolver/aoty-resolver.service";
import {AlbumsOfTheYearComponent} from "./albums-of-the-year/albums-of-the-year.component";
import {AggregatedDecadeComponent} from "./albums-of-the-year/aggregated-decade/aggregated-decade.component";
import {AotyDecadeAggregateResolverService} from "./common/resolver/aoty-decade-aggregate.resolver.service";
import {AggregatedSotyComponent} from "./songs-of-the-week/aggregated-soty/aggregated-soty.component";
import {SotwAggregateResolverService} from "./common/resolver/sotw-aggregate.resolver.service";
import {AggregatedVariousComponent} from "./albums-of-the-year/aggregated-various/aggregated-various.component";
import {AotyAggregateResolverService} from "./common/resolver/aoty-aggregate.resolver.service";
import {AliasResolverService} from "./common/resolver/alias.resolver.service";
import {MoviesOfTheYearComponent} from "./movies-of-the-year/movies-of-the-year.component";
import {MotyResolverService} from "./common/resolver/moty.resolver.service";
import {HomeMoviesComponent} from "./home/home-movies/home-movies.component";
import {RecapComponent} from "./albums-of-the-year/recap/recap.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: 'movie-home', component: HomeMoviesComponent, resolve: [MotyResolverService] },
  { path: 'sotw/:week', component: SongsOfTheWeekComponent, resolve: [SotwItemResolverService, SotwResolverService, AotyResolverService] },
  { path: 'aoty/:year', component: AlbumsOfTheYearComponent, resolve: [AotyItemResolverService, SotwResolverService, AotyResolverService] },
  { path: 'aoty/recap/:year', component: RecapComponent, resolve: [AotyItemResolverService, SotwResolverService, AotyResolverService] },
  { path: 'soty/:year', component: AggregatedSotyComponent, resolve: [SotwResolverService, AotyResolverService, SotwAggregateResolverService] },
  { path: 'aoty-decade/:decade', component: AggregatedDecadeComponent, resolve: [AotyResolverService, SotwResolverService, AotyDecadeAggregateResolverService] },
  { path: 'aoty-lists/:query',  component: AggregatedVariousComponent, resolve: [AotyResolverService,  SotwResolverService, AotyAggregateResolverService, AliasResolverService] },
  { path: 'moty/:year', component: MoviesOfTheYearComponent, resolve: [MotyResolverService] },
  { path: 'moty-lists/:query', component: MoviesOfTheYearComponent, resolve: [MotyResolverService] },
  { path: 'error/404', component: NotFoundComponent, resolve: [SotwResolverService, AotyResolverService] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' },
];
