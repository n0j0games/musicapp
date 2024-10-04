import {Component, OnInit} from '@angular/core';
import {AotyItem} from "../../models/aoty-item";
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../../services/aoty.service";
import {AlbumDetailComponent} from "../album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {Album} from "../../models/album";

@Component({
  selector: 'app-aggregated-decade',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './aggregated-decade.component.html'
})
export class AggregatedDecadeComponent implements OnInit {

  activeDecade : number = 0;

  albumsOfTheDecade! : AotyItem | null;

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {
    const decade = this.route.snapshot.paramMap.get('decade');
    if (decade === undefined || decade === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined decade, routed to 404"));
      return;
    }
    this.activeDecade = <number><unknown>decade;

    let aotyItems = this.aotyService.getAlbumsOfTheDecade(this.activeDecade);
    if (aotyItems == null) {
      this.router.navigate(['**']).then(() => console.error("Empty decade, routed to 404"));
      return;
    }
    aotyItems = aotyItems.sort((a, b) => b.year - a.year)
    let albums : Album[] = [];
    for (const item of aotyItems) {
      albums = albums.concat(item.albums);
    }
    albums = albums.filter(value => value.rating >= 7);
    this.albumsOfTheDecade = { year : parseInt(decade), albums : albums, isDecade : true };
    this.albumsOfTheDecade.albums = this.albumsOfTheDecade.albums.sort((a, b) => b.rating - a.rating);
  }

}