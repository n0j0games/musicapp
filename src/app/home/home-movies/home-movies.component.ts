import {Component, OnInit} from '@angular/core';
import {HomeSpecialComponent} from "../home-special/home-special.component";
import {ItemComponent} from "../item-group/item/item.component";
import {ItemGroupComponent} from "../item-group/item-group.component";
import {NgForOf} from "@angular/common";
import {MotyService} from "../../common/services/moty.service";
import {MotyItem} from "../../common/models/moty-item";
import {RouterLink} from "@angular/router";
import {Movie} from "../../common/models/movie";

@Component({
  selector: 'app-home-movies',
  standalone: true,
  imports: [
    HomeSpecialComponent,
    ItemComponent,
    ItemGroupComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './home-movies.component.html'
})
export class HomeMoviesComponent implements OnInit {

  constructor(private motyService : MotyService) {
  }

  motyItemsGroupedByYear : { year : number, week? : number, preview? : string[] }[] = [];
  seriesItemsGroupedByYear : { year : number, week? : number, preview? : string[] }[] = [];

  ngOnInit() {

    const motyItems : MotyItem[] = this.motyService.getAllMovies();
    motyItems.sort((a, b) => b.year! - a.year!);
    for (const motyItem of motyItems) {
      this.motyItemsGroupedByYear.push({ year : motyItem.year!, preview : motyItem.items.sort((a, b) => this.getSeasonalRating(b) - this.getSeasonalRating(a)).map(value => value.imgSrc).slice(0, 4) });
    }

    const seriesItems : MotyItem[] = this.motyService.getAllSeries();
    seriesItems.sort((a, b) => b.year! - a.year!);
    for (const seriesItem of seriesItems) {
      this.seriesItemsGroupedByYear.push({ year : seriesItem.year!, preview : seriesItem.items.sort((a, b) => this.getSeasonalRating(b) - this.getSeasonalRating(a)).map(value => value.imgSrc).slice(0, 4) });
    }
  }

  getSeasonalRating(movie : Movie) {
    if (Array.isArray(movie.rating)) {
      return movie.rating[0];
    }
    return movie.rating
  }

}
