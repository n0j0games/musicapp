import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, QueryParamsHandling, Router} from "@angular/router";
import {AotyService} from "../common/services/aoty.service";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {SongDetailComponent} from "../songs-of-the-week/song-detail/song-detail.component";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";
import {Album} from "../common/models/album";
import {Sorting} from "../common/models/sorting.enum";
import {AliasList} from "../common/models/alias-list";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ListHeaderComponent} from "../common/components/list-header/list-header.component";
import { NormalizeHelper } from "../common/normalize-helper";

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
    UpperCasePipe,
    ListHeaderComponent
  ],
  templateUrl: './albums-of-the-year.component.html'
})
export class AlbumsOfTheYearComponent implements OnInit {

  albumsOfTheYear! : Album[] | null;
  albumsOfTheYearWithoutMaxCap! : Album[] | null;
  rawAlbumsOfTheYear! : Album[] | null;
  aliasList!: AliasList | null;

  qSorting : Sorting = Sorting.RATING;
  qYear : number | null = null;
  qDecade : number | null = null;
  qSearch : string | null = null;
  qRating : number | null = null;
  isStrict : boolean = false;
  maxCap = MAX_CAP_DEFAULT;

  title = "albums of the year";
  sortingTitle = "";
  private startYear: number = 1965;
  yearOptions_ : number[] = Array.from({ length: (new Date().getFullYear() - this.startYear + 1) }, (_, i) => this.startYear + i);
  decadeOptions = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
  sortingOptions = <Sorting[]>Object.values(Sorting);

  formGroup = new FormGroup({
    search : new FormControl<string>(''),
    sorting: new FormControl<Sorting | null>(null),
    year: new FormControl<number | null>({value: null, disabled: this.yearOptions.length === 0}, Validators.required),
    rating: new FormControl<number | null>(null),
    decade: new FormControl<number | null>(null)
  });

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.updateParams(params);
    });

    this.aliasList = this.aotyService.getAliasList()!;
    this.rawAlbumsOfTheYear = this.getAggregatedAlbums();
    this.albumsOfTheYearWithoutMaxCap = [...this.rawAlbumsOfTheYear];
    this.refreshAlbums();
  }

  get yearOptions() {
    if (this.qDecade === null) {
      return [];
    }
    return this.yearOptions_.filter(value => value >= this.qDecade! && value < (this.qDecade! + 10))
  }

  loadMore() {
    this.maxCap = this.maxCap + MAX_CAP_DEFAULT;
    this.cutAlbums();
  }

  submitForm() {
    this.updateForm(null);
  }

  resetForm() {
    this.navigateAfterFormChange({});
  }

  resetItem(name: string) {
    this.updateForm(name);
  }

  private updateForm(resetComponent: string | null) {
    const queryParams : Params = {};
    this.updateSearch(queryParams);
    this.updateSorting(queryParams);
    this.updateYearAndDecade(queryParams);
    this.updateRating(queryParams);
    if (resetComponent !== null) {
      queryParams[resetComponent] = undefined;
    }
    this.navigateAfterFormChange(queryParams);
  }

  private navigateAfterFormChange(queryParams : Params) {
    this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'replace'
        }
    ).then(_ => {console.log("Refreshed params")});
  }

  private updateRating(queryParams: Params) {
    const qRating = this.formGroup.get('rating')?.value;
    if (qRating !== null) {
      queryParams['r'] = qRating;
    } else {
      queryParams['r'] = undefined;
    }
  }

  private updateYearAndDecade(queryParams: Params) {
    const qDecade = this.formGroup.get('decade')?.value;
    const qYear = this.formGroup.get('year')?.value;
    if (qYear !== null && qYear !== undefined && qDecade !== undefined && qDecade !== null) {
      if (qYear >= qDecade && qYear < (qDecade + 10)) {
        queryParams['y'] = qYear;
      } else {
        queryParams['y'] = null;
      }
    } else {
      queryParams['y'] = null;
    }
    if (qDecade !== null) {
      queryParams['d'] = qDecade;
    } else {
      queryParams['d'] = undefined;
    }
  }

  private updateSorting(queryParams: Params) {
    const qSorting = this.formGroup.get('sorting')?.value;
    if (qSorting !== undefined && qSorting !== null) {
      queryParams['s'] = qSorting.toLowerCase();
    } else {
      queryParams['s'] = undefined;
    }
  }

  private updateSearch(queryParams: Params) {
    let qSearch: string | null | undefined = this.formGroup.get("search")?.value;
    if (qSearch !== undefined && qSearch !== null && qSearch !== "") {
      queryParams['q'] = NormalizeHelper.fromNormalToQueryString(qSearch);
    } else {
      queryParams['q'] = undefined;
    }
  }

  private updateParams(params: Params) {
    const sorting = params['s'];
    const year = params['y'];
    const decade = params['d'];
    const search = params['q'];
    const rating = params['r'];
    const isStrict = params['type'] !== undefined && params['type'] !== null ?
        params['type'] === "strict" :
        false;
    this.maxCap = MAX_CAP_DEFAULT;
    this.qSorting = !!sorting && Object.values(Sorting).includes(sorting) ? <Sorting>sorting : Sorting.RATING
    this.qDecade = !!decade && decade % 10 === 0 ? parseInt(decade) : null;
    this.qYear = !!year && !!decade ? parseInt(year) : null;
    this.qSearch = !!search ? NormalizeHelper.fromQueryStringToNormal(search) : null;
    this.isStrict = isStrict;
    this.qRating = !!rating && rating >= 0 && rating <= 10 ? parseInt(rating) : null;

    this.formGroup.patchValue({
      search: this.qSearch,
      sorting: this.qSorting,
      year: this.qYear,
      decade: this.qDecade,
      rating: this.qRating,
    });
    if (this.yearOptions.length > 0) {
      this.formGroup.controls.year.enable();
    } else {
      this.formGroup.controls.year.disable();
    }
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
    this.updateSubTitle();
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
    this.title = "all albums i've listened to";
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
    if (this.qSearch !== null) {
      this.title = " albums by " + this.qSearch.replace("-", " ") + "";
    }
  }

  private updateSubTitle() {
    this.sortingTitle = "";
    if (this.qYear !== null) {
      this.sortingTitle = "from " + this.qYear;
    }
    if (this.qYear === null && this.qDecade !== null) {
      this.sortingTitle = "from the " + this.qDecade + "s";
    }
    if (this.qRating !== null) {
      this.sortingTitle = this.sortingTitle + " rated " + this.qRating;
    }
    if (this.qSorting !== null) {
      this.sortingTitle = this.sortingTitle + " sorted by " + this.qSorting;
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
    const title = NormalizeHelper.fromNormalToQueryString(album.title);
    if (this.isStrict && title === this.qSearch) {
      return true;
    }
    if (title.startsWith(this.qSearch)) {
      return true;
    }
    const artist = NormalizeHelper.fromNormalToQueryString(album.artist);
    const qArtist = NormalizeHelper.fromNormalToQueryString(this.qSearch);
    if (this.isStrict) {
      return artist === qArtist;
    } else {
      return qArtist.includes(artist) || artist.includes(qArtist) || this.includedInAliases(album.artist, qArtist);
    }
  }

  private includedInAliases(artist : string, qArtist: string) : boolean {
    const aliases = this.getGroupAliases(artist.toLowerCase(), this.aliasList!);
    if (aliases.length > 0) {
      console.log(artist, aliases);
    }
    for (const alias of aliases) {
      if (qArtist.includes(alias)) {
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

  private getGroupAliases(artist : string, aliasList : AliasList) {
    const results : string[] = [];
    for (let item of aliasList.groups) {
      if (item.group === artist) {
        return item.members.map(x => NormalizeHelper.fromNormalToQueryString(x));
      }
      if (item.members.includes(artist)) {
        results.push(NormalizeHelper.fromNormalToQueryString(item.group));
      }
    }
    return results;
  }

  protected readonly Object = Object;
}
