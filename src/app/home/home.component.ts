import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Album} from "../albums-of-the-year/models/album";
import {ItemComponent} from "./item/item.component";
import {HighlightCardComponent} from "../common/components/highlight-card/highlight-card.component";
import {Sorting} from "../common/utils/sorting.enum";
import {AotyService} from "../albums-of-the-year/services/aoty.service";

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
  loading: boolean = true;

  constructor(private aotyService : AotyService) {
  }

  ngOnInit() {
    this.aotyService.searchAndMapAotyItems({}).subscribe(p => {
      const aggAlbums = p.albums;
      this.rotationList = [...aggAlbums]
          .sort((a, b) => (b.playTime30Days ? b.playTime30Days : 0) - (a.playTime30Days ? a.playTime30Days : 0))
          .map(value => value.imgUrl).slice(0, 4);
      this.recentlyAddedList = [...aggAlbums]
          .filter(a => a.logged !== undefined && a.logged)
          .sort((a, b) => b.logged!.localeCompare(a.logged!))
          .map(value => value.imgUrl)
          .slice(0, 4);
      this.loading = false;
    });
  }

  protected readonly Sorting = Sorting;
}
