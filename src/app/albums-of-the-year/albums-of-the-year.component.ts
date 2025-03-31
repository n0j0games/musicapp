import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AotyService} from "../common/services/aoty.service";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {SongDetailComponent} from "../songs-of-the-week/song-detail/song-detail.component";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";
import {Album} from "../common/models/album";
import {Sorting} from "../common/models/sorting.enum";
import {AliasList} from "../common/models/alias-list";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

const MAX_CAP_DEFAULT = 200;

@Component({
  selector: 'app-albums-of-the-year',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    SongDetailComponent,
    AlbumDetailComponent,
    FormsModule,
    ReactiveFormsModule,
    UpperCasePipe
  ],
  templateUrl: './albums-of-the-year.component.html'
})
export class AlbumsOfTheYearComponent implements OnInit {

  albumsOfTheYear! : Album[] | null;
  albumsOfTheYearWithoutMaxCap! : Album[] | null;
  rawAlbumsOfTheYear! : Album[] | null;

  qSorting : Sorting = Sorting.RATING;
  qYear : number | null = null;
  qDecade : number | null = null;
  qSearch : string | null = null;
  qRating : number | null = null;
  isStrict : boolean = false;
  maxCap = MAX_CAP_DEFAULT;

  title = "albums of the year";
  sortingTitle = "";
  years = Array.from({ length: 56 }, (_, i) => 1970 + i);
  decades = [1970, 1980, 1990, 2000, 2010, 2020];

  formGroup! : FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      search : new FormControl(''),
      sorting: new FormControl(''),
      year: new FormControl(''),
      rating: new FormControl(''),
      decade: new FormControl('')
    });

    this.route.queryParams.subscribe(params => {
      this.updateParams(params);
    });

    this.rawAlbumsOfTheYear = this.getAggregatedAlbums();
    this.albumsOfTheYearWithoutMaxCap = [...this.rawAlbumsOfTheYear];
    this.refreshAlbums();
  }

  loadMore() {
    this.maxCap = this.maxCap + MAX_CAP_DEFAULT;
    this.cutAlbums();
  }

  submitForm() {
    const queryParams : Params = {};

    let qSearch: string | null = this.formGroup.get("search")?.value;
    if (qSearch !== null && qSearch !== "") {
      qSearch = qSearch.replaceAll(" ", "-").toLowerCase();
      queryParams['s'] = qSearch;
    } else {
      queryParams['s'] = undefined;
    }

    const qSorting = this.formGroup.get('sorting')?.value;
    if (qSorting !== null) {
      queryParams['sort'] = qSorting.toLowerCase();
    } else {
      queryParams['sort'] = undefined;
    }

    const qYear = this.formGroup.get('year')?.value;
    if (qYear !== null && qYear !== "") {
      queryParams['y'] = qYear;
    } else {
      queryParams['y'] = undefined;
    }

    const qDecade = this.formGroup.get('decade')?.value;
    if (qDecade !== null && qDecade !== "") {
      queryParams['d'] = qDecade;
    } else {
      queryParams['d'] = undefined;
    }

    const qRating = this.formGroup.get('rating')?.value;
    if (qRating !== null && qRating !== "") {
      queryParams['r'] = qRating;
    } else {
      queryParams['r'] = undefined;
    }
    this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge'
        }
    ).then(_ => {console.log("Refreshed params")});
  }

  private updateParams(params: Params) {
    const sorting = params['sort'];
    const year = params['y'];
    const decade = params['d'];
    const search = params['s'];
    const rating = params['r'];
    const isStrict = params['type'] !== undefined && params['type'] !== null ?
        params['type'] === "strict" :
        false;
    this.maxCap = MAX_CAP_DEFAULT;
    this.qSorting = !!sorting && Object.values(Sorting).includes(sorting) ?sorting.toUpperCase() : Sorting.RATING
    this.qYear = !!year ? parseInt(year) : null;
    this.qDecade = !!decade && decade % 10 === 0 ? parseInt(decade) : null;
    this.qSearch = !!search ? search.replaceAll("-", " ") : null;
    this.isStrict = isStrict;
    this.qRating = !!rating && rating >= 0 && rating <= 10 ? parseInt(rating) : null;

    this.formGroup.setValue({
      search: this.qSearch,
      sorting: this.qSorting,
      year: this.qYear,
      decade: this.qDecade,
      rating: this.qRating
    });

    this.refreshAlbums();
  }

  private cutAlbums(): void {
    if (!this.albumsOfTheYearWithoutMaxCap || this.albumsOfTheYearWithoutMaxCap.length === 0) {
      this.albumsOfTheYear = [];
      return;
    }
    this.albumsOfTheYear = [...this.albumsOfTheYearWithoutMaxCap].slice(0, this.maxCap < this.albumsOfTheYearWithoutMaxCap.length ? this.maxCap : this.albumsOfTheYearWithoutMaxCap.length);
  }

  private refreshAlbums(): void {
    if (!this.rawAlbumsOfTheYear || this.rawAlbumsOfTheYear.length === 0) {
      this.cutAlbums();
      return;
    }
    this.title = "";
    const albumCopy : Album[] = [...this.rawAlbumsOfTheYear];
    const filteredAlbums = this.filterAlbums(albumCopy);
    this.albumsOfTheYearWithoutMaxCap = this.sortAlbums(filteredAlbums);
    this.cutAlbums();
  }

  private sortAlbums(albums: Album[]): Album[] {
    const sortedBy = "sorted by "
    this.sortingTitle = sortedBy + this.qSorting;
    albums = albums.sort((a, b) => b.rating - a.rating);
    switch (this.qSorting) {
      case Sorting.ALPHABETICAL:
        this.sortingTitle = "sorted alphabetically by title";
        return albums.sort((a, b) => a.title.localeCompare(b.title));
      case Sorting.ARTIST:
        this.sortingTitle = "sorted alphabetically by artist";
        return albums.sort((a, b) => a.artist.localeCompare(b.artist));
      case Sorting.PlAY_TIME:
        this.sortingTitle = "sorted by playtime";
        return albums.filter(a => a.playTime !== undefined && a.playTime !== 0).sort((a, b) => b.playTime! - a.playTime!);
      case Sorting.RECENT:
        this.sortingTitle = "sorted by recent playtime";
        return albums.filter(a => a.playTime30Days !== undefined && a.playTime30Days !== 0).sort((a, b) => b.playTime30Days! - a.playTime30Days!)
      case Sorting.RATING:
        return albums.sort((a, b) => b.rating - a.rating);
      case Sorting.RELEASE_DATE:
        return albums.sort((a, b) => (a.year ? a.year : 9999) - (b.year ? b.year : 9999));
      default:
        return albums;
    }
  }

  private filterAlbums(albums: Album[]): Album[] {
    this.title = "all albums";
    if (this.qYear === null &&
        this.qDecade === null &&
        this.qSearch === null &&
        this.qRating === null) {
      return albums;
    }
    this.updateTitle();
    const filteredAlbums: Album[] = [];
    for (const album of albums) {
      const isAlbumValid = this.passYearFilter(album) &&
          this.passDecadeFilter(album) &&
          this.passQueryFilter(album) &&
          this.passRatingFilter(album);
      if (isAlbumValid) {
        filteredAlbums.push(album);
      }
    }
    return filteredAlbums;
  }

  private updateTitle() {
    if (this.qYear !== null) {
      this.title = "albums from " + this.qYear;
    }
    if (this.qYear === null && this.qDecade !== null) {
      this.title = "albums from the " + this.qDecade + "s";
    }
    if (this.qRating !== null) {
      this.title = this.title.replace("albums", "albums rated " + this.qRating);
    }
    if (this.qSearch !== null) {
      this.title = this.title + " matching '" + this.qSearch.replace("-", " ") + "'";
    }
  }

  private passYearFilter(album: Album): boolean {
    if (this.qYear === null) {
      return true;
    }
    return album.year === this.qYear;
  }

  private passRatingFilter(album: Album): boolean {
    if (this.qRating === null) {
      return true;
    }
    if (this.qRating >= 10) {
      return album.rating >= 10;
    }
    if (this.qRating <= 1) {
      return album.rating <= 1;
    }
    return album.rating >= this.qRating && album.rating < (this.qRating + 1);
  }

  private passDecadeFilter(album: Album): boolean {
    if (this.qDecade === null || this.qYear !== null) {
      return true;
    }
    return album.year! >= this.qDecade && album.year! < (this.qDecade + 10);
  }

  private passQueryFilter(album: Album): boolean {
    if (this.qSearch === null) {
      return true;
    }
    const title = album.title.toLowerCase().replaceAll(" ", "-").replaceAll("%20", "-");
    if (title.startsWith(this.qSearch)) {
      return true;
    }
    const artist = album.artist.toLowerCase().replaceAll(" ", "-").replaceAll("%20", "-");
    const qArtist = this.qSearch.toLowerCase();
    if (this.isStrict) {
      return artist === qArtist;
    } else {
      return artist.includes(qArtist) || this.includedInAliases(artist);
    }
  }

  private includedInAliases(artist : string) : boolean {
    const aliases = this.getAliases(artist, this.aotyService.getAliasList()!);
    const lowerCaseArtist = artist.toLowerCase();
    for (const alias of aliases) {
      if (lowerCaseArtist.includes(alias)) {
        return true;
      }
    }
    return false;
  }

  private getAggregatedAlbums() : Album[] {
    let aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
    if (aotyItems == null) {
      this.router.navigate(['**']).then(() => console.error("Empty, routed to 404"));
      return [];
    }
    let albums : Album[] = [];
    for (const item of aotyItems) {
      const albums_ = item.albums.slice();
      for (const album of albums_) {
        if (album.year === undefined) {
          album.year = item.year;
        }
      }
      albums = albums.concat(albums_);
    }
    return albums;
  }

  private getAliases(artist : string, aliasList : AliasList) {
    const results : string[] = [];
    for (let item of aliasList.items) {
      if (item.group === artist) {
        return item.members;
      }
      if (item.members.includes(artist)) {
        results.push(item.group.toLowerCase());
      }
    }
    return results;
  }

  protected readonly Object = Object;
  protected readonly Sorting = Sorting;
}
