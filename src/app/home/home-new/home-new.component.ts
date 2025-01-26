import {Component, OnInit} from '@angular/core';
import {ItemComponent} from "../item-group/item/item.component";
import {ItemGroupComponent} from "../item-group/item-group.component";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../../common/services/sotw.service";
import {AotyService} from "../../common/services/aoty.service";
import {SotwList} from "../../common/models/sotw-list";
import {SotwItem} from "../../common/models/sotw-item";
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

  constructor(private aotyService : AotyService) {
  }

  ngOnInit() {

    const aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    const rotation = this.getAggregatedAlbums(queryYears);
    this.rotationList = rotation
        .sort((a, b) => (b.playTime30Days ? b.playTime30Days : 0) - (a.playTime30Days ? a.playTime30Days : 0))
        .map(value => value.imgUrl).slice(0, 4);

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

}
