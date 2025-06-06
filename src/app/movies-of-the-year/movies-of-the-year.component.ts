import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MotyItem} from "../common/models/moty-item";
import {MotyService} from "../common/services/moty.service";
import {AlbumDetailComponent} from "../albums-of-the-year/album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {MovieDetailComponent} from "./movie-detail/movie-detail.component";
import {Movie} from "../common/models/movie";
import {Logger} from "../common/logger";

@Component({
  selector: 'app-movies-of-the-year',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    NgForOf,
    NgIf,
    MovieDetailComponent
  ],
  templateUrl: './movies-of-the-year.component.html'
})
export class MoviesOfTheYearComponent implements OnInit {

  activeYear : number = 0;
  thisYear = new Date().getFullYear();
  moviesOfTheYear! : MotyItem | null;
  aggregatedTitle : string | null = null;

  private aliases : string [] | null = null;
  private logger: Logger = new Logger(this);

  constructor(private route: ActivatedRoute, private router: Router, private motyService : MotyService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const year = this.route.snapshot.paramMap.get('year');
      const query = this.route.snapshot.paramMap.get('query');
      if (year === undefined && query === undefined) {
        this.router.navigate(['**']).then(() => this.logger.error("Undefined year/query, routed to 404"));
        return;
      }
      if (year !== null) {
        this.updateMovies(year);
      }
      if (query !== null) {
        this.updateAggregatedMovies(query);
      }
    });
  }

  updateAggregatedMovies(query : string | null) {
    switch (query) {
      case "all":
        this.getAllMoviesOrShows();
        this.aggregatedTitle = "every movie & show I've watched";
        break;
      case "all-movies":
        this.getAllMoviesOrShows();
        this.aggregatedTitle = "every movie I've watched";
        break;
      default:
        this.getMoviesByCreator(query!);
    }
  }

  private getMoviesByCreator(creator : string) {
    creator = creator.toLowerCase().replaceAll("-"," ");
    if (creator.includes(",\n")) {
      const creators = creator.split(",\n");
      creator = creator.replaceAll(",\n", " & ");
      this.aliases = creators;
    } else {
      this.aliases = [creator];
    }
    const movies = this.getAggregatedMovies().filter(value => value.creator!.toLowerCase().includes(creator) || this.includedInAliases(value.creator!.toLowerCase()));
    this.moviesOfTheYear = new MotyItem([], 0);
    this.moviesOfTheYear.items = movies.sort((a, b) => b.rating - a.rating);
    this.aggregatedTitle = "my fav movies & shows by " + creator;
  }

  private includedInAliases(artist : string) : boolean {
    const lowerCaseCreator = artist.toLowerCase();
    for (const alias of this.aliases!) {
      if (lowerCaseCreator.includes(alias)) {
        return true;
      }
    }
    return false;
  }

  private getAggregatedMovies() : Movie[] {
    let motyItem = this.motyService.getAllUnsortedMovies();
    if (motyItem == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty query, routed to 404"));
      return [];
    }
    return motyItem.items;
  }

  getAllMoviesOrShows() {
    this.moviesOfTheYear = this.motyService.getAllUnsortedMovies();
    if (this.moviesOfTheYear == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty list, routed to 404"));
      return;
    }
    this.moviesOfTheYear.items = this.moviesOfTheYear.items.sort((a, b) => b.rating - a.rating);
  }

  updateMovies(year : string | null) {
    this.activeYear = <number><unknown>year;
    this.moviesOfTheYear = this.motyService.getMoviesOfTheYear(this.activeYear);
    if (this.moviesOfTheYear == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty year, routed to 404"));
      return;
    }
    this.moviesOfTheYear.items = this.moviesOfTheYear.items.sort((a, b) => b.rating - a.rating);
  }

}
