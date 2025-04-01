import {Component, OnInit} from '@angular/core';
import {ItemComponent} from "../item-group/item/item.component";
import {ItemGroupComponent} from "../item-group/item-group.component";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../../common/services/sotw.service";
import {AotyService} from "../../common/services/aoty.service";
import {SotwList} from "../../common/models/sotw-list";
import {Album} from "../../common/models/album";

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [
    ItemComponent,
    ItemGroupComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './home-new.component.html',
  styleUrl: './home-new.component.scss'
})
export class HomeNewComponent implements OnInit {

  rotationList : string[] = [];
  currentYearList : string[] = [];
  currentWeek = 0;
  currentYear = 2025;
  currentWeekItems : string[] = [];

  constructor(private aotyService : AotyService, private sotwService: SotwService) {
  }

  ngOnInit() {

    this.sotwListChangedListener();
    const aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    const rotation = this.getAggregatedAlbums(queryYears);
    this.rotationList = rotation
        .sort((a, b) => (b.playTime30Days ? b.playTime30Days : 0) - (a.playTime30Days ? a.playTime30Days : 0))
        .map(value => value.imgUrl).slice(0, 4);

    this.currentYearList = this.aotyService.getAlbumsOfTheYear(2025)!.albums.sort((a, b) => b.rating - a.rating).map(value => value.imgUrl).slice(0, 4);
  }

  private getAggregatedAlbums(queryYears : number[]) : Album[] {
    let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
    aotyItems = aotyItems!.sort((a, b) => a.year - b.year);
    let albums : Album[] = [];
    for (const item of aotyItems) {
      const albums_ = item.albums.slice();
      albums = albums.concat(albums_);
    }
    return albums;
  }

  private sotwListChangedListener() {
    const sotwList = this.sotwService.getSotwList();
    if (sotwList === null || sotwList.items === undefined) {
      this.sotwService.sotwListChanged$.subscribe({
        next: (v) => {
          this.setCurrentWeek(v);
        },
        error: (e) => console.error(e)
      })
      return;
    }
    this.setCurrentWeek(sotwList);
  }

  private setCurrentWeek(sotwList : SotwList) {
    if (sotwList.items !== undefined) {
      const sotwItems = sotwList.items.sort((a, b) => b.year - a.year || b.week - a.week);
      console.log(sotwItems);
      this.currentWeek = sotwItems[0].week;
      this.currentYear = sotwItems[0].year;
      this.currentWeekItems = sotwItems[0].preview!;
    }
  }

}
