import {Component, OnInit} from '@angular/core';
import {SotwItem} from "../../common/models/sotw-item";
import {ActivatedRoute, Router} from "@angular/router";
import {SotwService} from "../../common/services/sotw.service";
import {Song} from "../../common/models/song";
import {NgForOf, NgIf} from "@angular/common";
import {SongDetailComponent} from "../song-detail/song-detail.component";
import {Logger} from "../../common/logger";

@Component({
  selector: 'app-aggregated-soty',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SongDetailComponent
  ],
  templateUrl: './aggregated-soty.component.html'
})
export class AggregatedSotyComponent implements OnInit {

  activeYear : number = 0;

  songsOfTheYear! : SotwItem | null;

  private logger: Logger = new Logger(this);

  constructor(private route: ActivatedRoute, private router: Router, private sotwService : SotwService) {}

  ngOnInit(): void {
    const year = this.route.snapshot.paramMap.get('year');
    if (year === undefined || year === null) {
      this.router.navigate(['**']).then(() => this.logger.error("Undefined year, routed to 404"));
      return;
    }
    this.activeYear = parseInt(year);
    const sotyItem = this.sotwService.getSongsOfTheYear(this.activeYear);
    this.logger.debug("SOTY", this.songsOfTheYear)
    if (sotyItem == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty year, routed to 404"));
      return;
    }
    let songs  : Song[] = [];
    for (const item of sotyItem) {
      songs = songs.concat(item.songs);
    }
    this.songsOfTheYear = { year : this.activeYear, week : 0, songs: songs }
    this.songsOfTheYear.songs = this.songsOfTheYear.songs.sort((a, b) => b.rating - a.rating);
  }

}

