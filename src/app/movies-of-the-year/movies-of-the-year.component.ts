import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MotyItem} from "../common/models/moty-item";
import {MotyService} from "../common/services/moty.service";
import {AlbumDetailComponent} from "../albums-of-the-year/album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {MovieDetailComponent} from "./movie-detail/movie-detail.component";
import {Movie} from "../common/models/movie";

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

  constructor(private route: ActivatedRoute, private router: Router, private motyService : MotyService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const year = this.route.snapshot.paramMap.get('year');
      this.update(year);
    });
  }

  update(year : string | null) {
    if (year === undefined || year === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined year, routed to 404"));
      return;
    }
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
      return movie.rating[this.getActiveSeason(movie)-1];
    }
    console.log(movie.rating, "R")
    return movie.rating;
  }

  getActiveSeason(movie : Movie) : number {
    if (!movie.seasons) {
      return 0;
    }
    for (const yearIndex in movie.years) {
      if (movie.years[yearIndex] == this.activeYear) {
        const num = <number><unknown>yearIndex;
        return num - (-1);
      }
    }
    return 0;
  }

}
