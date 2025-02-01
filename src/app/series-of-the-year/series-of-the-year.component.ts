import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MotyItem} from "../common/models/moty-item";
import {MotyService} from "../common/services/moty.service";
import {AlbumDetailComponent} from "../albums-of-the-year/album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {SeriesDetailComponent} from "./series-detail/series-detail.component";
import {Movie} from "../common/models/movie";
import {Album} from "../common/models/album";

@Component({
  selector: 'app-movies-of-the-year',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    NgForOf,
    NgIf,
    SeriesDetailComponent
  ],
  templateUrl: './series-of-the-year.component.html'
})
export class SeriesOfTheYearComponent implements OnInit {

  activeYear : number = 0;
  thisYear = new Date().getFullYear();
  seriesOfTheYear! : MotyItem | null;
  aggregatedTitle : string | null = null;

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
        this.updateSeries(year);
      }
      if (query !== null) {
        this.updateAggregatedSeries(query);
      }
    });
  }

  updateAggregatedSeries(query : string | null) {
    switch (query) {
      case "all-shows":
        this.getAllSeries();
        this.aggregatedTitle = "every series I've watched";
        break;
    }
  }

  getAllSeries() {
    this.seriesOfTheYear = this.motyService.getAllUnsortedSeries();
    if (this.seriesOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty list, routed to 404"));
      return;
    }
    this.seriesOfTheYear.items = this.seriesOfTheYear.items.sort((a, b) => b.rating - a.rating);
  }

  updateSeries(year : string | null) {
    this.activeYear = <number><unknown>year;
    this.seriesOfTheYear = this.motyService.getSeriesOfTheYear(this.activeYear);
    if (this.seriesOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
      return;
    }
    this.seriesOfTheYear.items = this.seriesOfTheYear.items.sort((a, b) => b.rating - a.rating);
  }

}
