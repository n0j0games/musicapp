import { Routes } from '@angular/router';
import {SongsOfTheWeekComponent} from "./songs-of-the-week/songs-of-the-week.component";
import {NotFoundComponent} from "./common/components/not-found/not-found.component";
import {SotwResolverService} from "./songs-of-the-week/resolver/sotw-resolver.service";
import {SotwItemResolverService} from "./songs-of-the-week/resolver/sotw-item.resolver.service";
import {AlbumsOfTheYearComponent} from "./albums-of-the-year/albums-of-the-year.component";
import {AggregatedSotyComponent} from "./songs-of-the-week/aggregated-soty/aggregated-soty.component";
import {SotwAggregateResolverService} from "./songs-of-the-week/resolver/sotw-aggregate.resolver.service";
import {MotyResolverService} from "./shows-of-the-year/resolver/moty.resolver.service";
import {HomeComponent} from "./home/home.component";
import {AotyRecapComponent} from "./albums-of-the-year/aoty-recap/aoty-recap.component";
import {SotwRecapComponent} from "./songs-of-the-week/sotw-recap/sotw-recap.component";
import {AllAlbumsRecapComponent} from "./albums-of-the-year/all-albums-recap/all-albums-recap.component";
import {ReviewComponent} from "./review/review.component";
import {ReviewResolverService} from "./review/resolver/review-resolver.service";
import {ShowsOfTheYearComponent} from "./shows-of-the-year/shows-of-the-year.component";
import {DiscographiesComponent} from "./home/discographies/discographies.component";
import {AddAlbumsComponent} from "./admin/add-albums/add-albums.component";
import {permissionGuard} from "./common/guards/permission.guard";

export const routes: Routes = [
  { path: 'admin', component: AddAlbumsComponent, canActivate: [permissionGuard] },
  { path: 'home', component: HomeComponent, resolve: [SotwResolverService] },
  { path: 'home/discographies', component: DiscographiesComponent },
  { path: 'review/:path', component: ReviewComponent, resolve: [ReviewResolverService]},
  { path: 'sotw/:week', component: SongsOfTheWeekComponent, resolve: [SotwItemResolverService, SotwResolverService] },
  { path: 'aoty', component: AlbumsOfTheYearComponent, resolve: [ SotwResolverService] },
  { path: 'aoty/recap/all', component: AllAlbumsRecapComponent, resolve: [SotwResolverService] },
  { path: 'aoty/recap/:year', component: AotyRecapComponent, resolve: [SotwResolverService] },
  { path: 'soty/:year', component: AggregatedSotyComponent, resolve: [SotwResolverService, SotwAggregateResolverService] },
  { path: 'soty/recap/:year', component: SotwRecapComponent, resolve: [SotwResolverService, SotwAggregateResolverService] },
  { path: 'shows', component: ShowsOfTheYearComponent, resolve: [MotyResolverService] },
  { path: 'error/404', component: NotFoundComponent, resolve: [SotwResolverService] },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' },
];
