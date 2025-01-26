import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../common/services/aoty.service";
import {AotyItem} from "../common/models/aoty-item";
import {NgForOf, NgIf} from "@angular/common";
import {SongDetailComponent} from "../songs-of-the-week/song-detail/song-detail.component";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";

@Component({
  selector: 'app-albums-of-the-year',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SongDetailComponent,
    AlbumDetailComponent
  ],
  templateUrl: './albums-of-the-year.component.html'
})
export class AlbumsOfTheYearComponent implements OnInit {

  activeYear : number = 0;
  thisYear = new Date().getFullYear();
  showBad = false;
  albumsOfTheYear! : AotyItem | null;

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {
    const year = this.route.snapshot.paramMap.get('year');
    if (year === undefined || year === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined year, routed to 404"));
      return;
    }
    this.activeYear = <number><unknown>year;

    this.albumsOfTheYear = this.aotyService.getAlbumsOfTheYear(this.activeYear);
    if (this.albumsOfTheYear == null) {
      this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
      return;
    }
    for (let album of this.albumsOfTheYear.albums) {
      if (album.year === undefined) {
        album.year = this.activeYear;
      }
    }
    this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating).filter(value => value.rating > 0);
  }

}
