import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MotyItem} from "../common/models/moty-item";
import {MotyService} from "../common/services/moty.service";
import {AlbumDetailComponent} from "../albums-of-the-year/album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {MovieDetailComponent} from "./movie-detail/movie-detail.component";
import {Movie} from "../common/models/movie";
import {Album} from "../common/models/album";

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

  constructor(private route: ActivatedRoute, private router: Router, private motyService : MotyService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const year = this.route.snapshot.paramMap.get('year');
      const query = this.route.snapshot.paramMap.get('query');
      if (year === undefined && query === undefined) {
        this.router.navigate(['**']).then(() => console.error("Undefined year/query, routed to 404"));
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
        this.getAlphabeticalAlbums();
        this.aggregatedTitle = "every movie & show I've watched";
        break;
      case "all-movies":
        this.getAllMoviesOrShows(true);
        this.aggregatedTitle = "every movie I've watched";
        break;
      case "all-shows":
        this.getAllMoviesOrShows(false);
        this.aggregatedTitle = "every show I've watched";
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
    const movies = this.getAggregatedMovies().filter(value => value.creator.toLowerCase().includes(creator) || this.includedInAliases(value.creator.toLowerCase()));
    this.moviesOfTheYear = new MotyItem([], 0);
    this.moviesOfTheYear.items = movies.sort((a, b) => this.getPeakRating(b) - this.getPeakRating(a));
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
      this.router.navigate(['**']).then(() => console.error("Empty query, routed to 404"));
      return [];
    }
    return motyItem.items;
  }

  getAllMoviesOrShows(onlyMovies : boolean) {
    this.getAlphabeticalAlbums();
    if (onlyMovies) {
      this.moviesOfTheYear!.items = this.moviesOfTheYear!.items.filter(value => value.seasons === undefined);
    } else {
      this.moviesOfTheYear!.items = this.moviesOfTheYear!.items.filter(value => value.seasons !== undefined);
    }
  }

  getAlphabeticalAlbums() {
    this.moviesOfTheYear = this.motyService.getAllUnsortedMovies();
    if (this.moviesOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty list, routed to 404"));
      return;
    }
    this.moviesOfTheYear.items = this.moviesOfTheYear.items.sort((a, b) => this.getPeakRating(b) - this.getPeakRating(a));
  }

  updateMovies(year : string | null) {
    this.activeYear = <number><unknown>year;
    this.moviesOfTheYear = this.motyService.getMoviesOfTheYear(this.activeYear);
    if (this.moviesOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
      return;
    }
    this.moviesOfTheYear.items = this.moviesOfTheYear.items.sort((a, b) => this.getCurrentRating(b) - this.getCurrentRating(a));
  }

  getCurrentRating(movie : Movie) : number {
    if (Array.isArray(movie.rating)) {
      return this.activeYear !== 0 ?
          movie.rating[this.getActiveSeason(movie)!-1] :
          Math.max(...movie.rating);
    }
    return movie.rating;
  }

  getPeakRating(movie : Movie) {
    if (Array.isArray(movie.rating)) {
      return Math.max(...movie.rating);
    }
    return movie.rating
  }

  getActiveSeason(movie : Movie) : number | undefined {
    if (!movie.seasons || this.activeYear === 0) {
      return undefined;
    }
    return movie.activeSeason;
    /*for (const yearIndex in movie.years) {
      if (movie.years[yearIndex] == this.activeYear) {
        const num = <number><unknown>yearIndex;
        return num - (-1);
      }
    }
    return 0;*/
  }

}
