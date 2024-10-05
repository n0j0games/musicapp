import {Component, OnInit} from '@angular/core';
import {AotyItem} from "../../models/aoty-item";
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../../services/aoty.service";
import {Album} from "../../models/album";
import {AlbumDetailComponent} from "../album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-aggregated-various',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './aggregated-various.component.html',
})
export class AggregatedVariousComponent implements OnInit {

  aggreatedAlbums! : AotyItem | null;
  aggregatedTitle! : string | null;

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {
    const aggregation = this.route.snapshot.paramMap.get('query');
    if (aggregation === undefined || aggregation === null) {
      this.router.navigate(['**']).then(() => console.error("Undefined aggregation, routed to 404"));
      return;
    }

    switch (aggregation) {
      case "perfect-albums":
        this.getFavAlbums(true);
        this.aggregatedTitle = "all the albums that I think are perfect";
        break;
      case "alphabetical":
        this.getAlphabeticalAlbums();
        this.aggregatedTitle = "every album I've rated";
        break;
      case "fav-albums":
        this.getFavAlbums(false);
        this.aggregatedTitle = "all the albums I love";
        break;
      case "the-weeknd":
        this.getArtistAlbums("The Weeknd", 2010);
        break;
      case "travis-scott":
        this.getArtistAlbums("Travis Scott", 2014);
        break;
      case "kanye-west":
        this.getArtistAlbums("Kanye West", 2000);
        break;
      case "kendrick-lamar":
        this.getArtistAlbums("Kendrick Lamar", 2010);
        break;
      case "tyler-the-creator":
        this.getArtistAlbums("Tyler, The Creator", 2000);
        break;
      case "beyonce":
        this.getArtistAlbums("Beyoncé", 2000);
        break;
      default:
        this.getArtistAlbums(aggregation.replaceAll("-"," "), 2000);
    }
  }

  getAlphabeticalAlbums() {
    let aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    let albums = this.getAggregatedAlbums(queryYears);
    this.aggreatedAlbums = { year : 0, albums : albums, isDecade : false };
    this.aggreatedAlbums.albums = this.aggreatedAlbums.albums.sort((a, b) => a.title.localeCompare(b.title));
  }

  getArtistAlbums(artist : string, activeSince : number, activeUntil? : number) {
    let aotyList = this.aotyService.getAotyList();
    const aotyQueryYears = aotyList!.items!.map(value => value.year);
    const queryYears : number[] = this.range(activeSince, activeUntil ? activeUntil : new Date().getFullYear(), 1)
        .filter(year => aotyQueryYears.includes(year));
    let albums = this.getAggregatedAlbums(queryYears);
    console.log(albums);
    albums = albums.filter(value => value.artist.toLowerCase().includes(artist.toLowerCase()));
    this.aggreatedAlbums = { year : 0, albums : albums, isDecade : false };
    this.aggreatedAlbums.albums = this.aggreatedAlbums.albums.sort((a, b) => b.rating - a.rating);
    this.aggregatedTitle = "my fav albums by " + artist;
  }

  getFavAlbums(onlyPerfect : boolean) {
    let aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    let albums = this.getAggregatedAlbums(queryYears);
    albums = albums.filter(value => onlyPerfect ? value.rating >= 10 : value.rating >= 8);
    this.aggreatedAlbums = { year : 0, albums : albums, isDecade : false };
    this.aggreatedAlbums.albums = this.aggreatedAlbums.albums.sort((a, b) => b.rating - a.rating);
  }

  private getAggregatedAlbums(queryYears : number[]) : Album[] {
    let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
    if (aotyItems == null) {
      this.router.navigate(['**']).then(() => console.error("Empty query, routed to 404"));
      return [];
    }
    aotyItems = aotyItems.sort((a, b) => b.year - a.year);
    let albums : Album[] = [];
    for (const item of aotyItems) {
      albums = albums.concat(item.albums);
    }
    return albums;
  }

  private range(start : number, stop : number, step : number) {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    );
  }

}