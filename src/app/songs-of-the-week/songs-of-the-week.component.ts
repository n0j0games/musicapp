import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SongDetailComponent} from "./song-detail/song-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {SotwItem} from "../models/sotw-item";
import {WeekHelper} from "../common/week-helper";

@Component({
  selector: 'app-songs-of-the-week',
  standalone: true,
  imports: [
    SongDetailComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './songs-of-the-week.component.html',
  styleUrl: './songs-of-the-week.component.scss'
})
export class SongsOfTheWeekComponent implements OnInit {

  activeWeek : number = 0;
  activeYear : number = 0;

  songsOfTheWeek! : SotwItem | null;

  weekHelper = new WeekHelper();

  constructor(private route: ActivatedRoute, private router: Router, private sotwService : SotwService) {}

  ngOnInit(): void {
    const week = this.route.snapshot.paramMap.get('week');
    if (week === undefined || week === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined week, routed to 404"));
      return;
    }
    this.activeYear = <number><unknown>week.slice(0, 4);
    this.activeWeek = <number><unknown>week.slice(4, 6);

    this.songsOfTheWeek = this.sotwService.getSongsOfWeek(this.activeWeek, this.activeYear);
    if (this.songsOfTheWeek == null) {
      this.router.navigate(['**']).then(() => console.error("Empty week, routed to 404"));
      return;
    }
    this.songsOfTheWeek.songs = this.songsOfTheWeek.songs.sort((a, b) => b.rating - a.rating);
  }

}
