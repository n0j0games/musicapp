import {Component, OnInit} from '@angular/core';
import {AotyItem} from "../../common/models/aoty-item";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AotyService} from "../../common/services/aoty.service";
import {Album} from "../../common/models/album";
import {AlbumDetailComponent} from "../album-detail/album-detail.component";
import {NgForOf, NgIf} from "@angular/common";
import {RatingComponent} from "../../common/components/rating/rating.component";
import {AliasList} from "../../common/models/alias-list";

@Component({
  selector: 'app-aggregated-various',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    NgForOf,
    NgIf,
    RatingComponent,
    RouterLink
  ],
  templateUrl: './aggregated-various.component.html',
})
export class AggregatedVariousComponent implements OnInit {

  aggreatedAlbums! : AotyItem | null;
  aggregatedTitle! : string | null;
  average : number | null = null;
  aliases : string [] | null = null;
  isGroup : boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private aotyService : AotyService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.onRouteChange();
    });
  }

  private onRouteChange() {
    this.aggregatedTitle = null;
    this.aggreatedAlbums = null;
    this.average = 0;
    this.aliases = null;
    this.isGroup = false;

    const aggregation = this.route.snapshot.paramMap.get('query');
    const queryParam = this.route.snapshot.queryParamMap.get('type');
    const isStrict = queryParam !== undefined && queryParam !== null ?
        queryParam === "strict" :
        false;

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
      case "rosalia":
        this.getArtistAlbums("rosalía", 2018, isStrict);
        break;
      case "tyler-the-creator":
        this.getArtistAlbums("tyler, the creator", 2000, isStrict);
        break;
      case "beyonce":
        this.getArtistAlbums("beyoncé", 2000, isStrict);
        break;
      case "j-cole":
        this.getArtistAlbums("j. cole", 2010, isStrict);
        break;
      case "jay-z":
        this.getArtistAlbums("jay-z", 2000, isStrict);
        break;
      case "rin":
        this.getArtistAlbums("rin", 2016, true);
        break;
      default:
        this.getArtistAlbums(aggregation.replaceAll("-"," "), 1960, isStrict);
    }
  }

  private getAlphabeticalAlbums() {
    let aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    let albums = this.getAggregatedAlbums(queryYears);
    this.aggreatedAlbums = { year : 0, albums : albums, isDecade : false };
    this.aggreatedAlbums.albums = this.aggreatedAlbums.albums.sort((a, b) => a.title.localeCompare(b.title)); //.filter(value => value.rating >= 5);
    console.log("AD", this.aggreatedAlbums.albums)
  }

  private getArtistAlbums(artist : string, activeSince : number, strict : boolean) {
    artist = artist.toLowerCase();
    let aotyList = this.aotyService.getAotyList();
    if (artist.includes(",\n")) {
      const artists = artist.split(",\n");
      this.isGroup = true;
      this.aliases = artists;
      artist = artist.replaceAll(",\n", " & ");
    } else {
      this.aliases = this.getAliases(artist, this.aotyService.getAliasList()!);
    }
    const aotyQueryYears = aotyList!.items!.map(value => value.year);
    const queryYears : number[] = this.range(activeSince, new Date().getFullYear(), 1)
        .filter(year => aotyQueryYears.includes(year));
    let albums = this.getAggregatedAlbums(queryYears);
    console.log("AD", albums)
    console.log(albums.filter(value => value.artist.toLowerCase().includes("jay")), "XXX");
    if (strict) {
      albums = albums.filter(value => value.artist.toLowerCase() === artist);
    } else {
      albums = albums.filter(value => value.artist.toLowerCase().includes(artist) || this.includedInAliases(value.artist.toLowerCase()));
    }
    this.aggreatedAlbums = { year : 0, albums : albums, isDecade : false };
    this.aggreatedAlbums.albums = this.aggreatedAlbums.albums.sort((a, b) => b.rating - a.rating);
    this.aggregatedTitle = "my fav albums by " + artist;
    this.calcAverage(albums);
  }

  private includedInAliases(artist : string) : boolean {
    const lowerCaseArtist = artist.toLowerCase();
    for (const alias of this.aliases!) {
      if (lowerCaseArtist.includes(alias)) {
        return true;
      }
    }
    return false;
  }

  private getAliases(artist : string, aliasList : AliasList) {
    const results : string[] = [];
    for (let item of aliasList.items) {
      if (item.group === artist) {
        this.isGroup = true;
        return item.members;
      }
      if (item.members.includes(artist)) {
        results.push(item.group.toLowerCase());
      }
    }
    return results;
  }

  private getFavAlbums(onlyPerfect : boolean) {
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
    aotyItems = aotyItems.sort((a, b) => a.year - b.year);
    let albums : Album[] = [];
    for (const item of aotyItems) {
      albums = albums.concat(item.albums);
    }
    return albums;
  }

  private calcAverage(albums : Album[]) {
    if (albums.length === 0) {
      this.average = null;
      return;
    }
    let avg = 0;
    for (const item of albums) {
      avg += item.rating;
    }
    this.average = avg / albums.length;
  }

  private range(start : number, stop : number, step : number) {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    );
  }

}