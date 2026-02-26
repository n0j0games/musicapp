import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {AotyService} from "../albums-of-the-year/services/aoty.service";
import {Album} from "../albums-of-the-year/models/album";
import {ItemComponent} from "./item/item.component";
import {HighlightCardComponent} from "../common/components/highlight-card/highlight-card.component";
import {Sorting} from "../common/utils/sorting.enum";

@Component({
  selector: 'app-home-new',
  standalone: true,
  imports: [
    ItemComponent,
    NgForOf,
    RouterLink,
    ItemComponent,
    HighlightCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  rotationList : string[] = [];
  recentlyAddedList: string[] = [];

  constructor(private aotyService : AotyService) {
  }

  ngOnInit() {
    const aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    const aggAlbums = this.getAggregatedAlbums(queryYears);
    this.rotationList = [...aggAlbums]
        .sort((a, b) => (b.playTime30Days ? b.playTime30Days : 0) - (a.playTime30Days ? a.playTime30Days : 0))
        .map(value => value.imgUrl).slice(0, 4);
    this.recentlyAddedList = [...aggAlbums]
        .filter(a => a.logged !== undefined && a.logged)
        .sort((a, b) => b.logged!.localeCompare(a.logged!))
        .map(value => value.imgUrl)
        .slice(0, 4);
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

  protected readonly Sorting = Sorting;
}
