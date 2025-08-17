import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SotwService} from "../common/services/sotw.service";
import {SongDetailComponent} from "./song-detail/song-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {SotwItem} from "../common/models/sotw-item";
import {WeekHelper} from "../common/week-helper";
import {Logger} from "../common/logger";

@Component({
  selector: 'app-songs-of-the-week',
  standalone: true,
  imports: [
    SongDetailComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './songs-of-the-week.component.html'
})
export class SongsOfTheWeekComponent implements OnInit {

  activeWeek : number = 0;
  activeYear : number = 0;

  songsOfTheWeek! : SotwItem | null;

  fridayOfTheWeek! : string;

  sotwList!: { year : number, week : number, preview? : string[] }[];

  previousWeekLink: string | undefined;
  nextWeekLink: string | undefined;

  private logger: Logger = new Logger(this);

  constructor(private route: ActivatedRoute, private router: Router, private sotwService : SotwService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.loadData();
    });
  }

  private loadData() {
    const week = this.route.snapshot.paramMap.get('week');
    if (week === undefined || week === null) {
      this.router.navigate(['**']).then(() => this.logger.error("Undefined week, routed to 404"));
      return;
    }
    this.activeYear = <number><unknown>week.slice(0, 4);
    this.activeWeek = <number><unknown>week.slice(4, 6);

    this.songsOfTheWeek = this.sotwService.getSongsOfWeek(this.activeWeek, this.activeYear);
    if (this.songsOfTheWeek == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty week, routed to 404"));
      return;
    }
    this.songsOfTheWeek.songs = this.songsOfTheWeek.songs.sort((a, b) => b.rating - a.rating);
    this.fridayOfTheWeek = WeekHelper.getFridayOfWeek(this.songsOfTheWeek?.week, this.songsOfTheWeek?.year )

    const sotwList = this.sotwService.getSotwList();
    if (sotwList == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty list, routed to 404"));
      return;
    }
    this.sotwList = [...sotwList.items!].sort((a, b) => a.year - b.year || a.week - b.week).filter(value => value.week !== <number><unknown>'00');

    this.getPreviousWeek();
    this.getNextWeek();
  }

  private getNextWeek() {
    const currentItem = this.getCurrentWeeksIndex();
    console.log('cur', this.sotwList, currentItem);
    if (currentItem === - 1 || currentItem >= this.sotwList.length - 1) {
      this.nextWeekLink = undefined;
      return;
    }
    const nextItem = this.sotwList[currentItem+1];
    console.log('ni', nextItem);
    this.nextWeekLink = nextItem.year.toString() + nextItem.week.toString();
  }

  private getPreviousWeek() {
    const currentItem = this.getCurrentWeeksIndex();
    console.log('cur', currentItem);
    if (currentItem <= 0) {
      this.previousWeekLink = undefined;
      return;
    }
    const prevItem = this.sotwList[currentItem-1];
    console.log('pi', prevItem);
    this.previousWeekLink = prevItem.year.toString() + prevItem.week.toString();
  }

  private getCurrentWeeksIndex(): number {
    const item = this.sotwList.filter(value => value.year === this.activeYear && value.week === this.activeWeek);
    if (item.length !== 1) {
      return -1;
    }
    return this.sotwList.indexOf(item[0]);
  }

}
