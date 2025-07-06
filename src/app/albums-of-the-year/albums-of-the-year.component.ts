import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AotyService} from "../common/services/aoty.service";
import {NgForOf, NgIf} from "@angular/common";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";
import {Album} from "../common/models/album";
import {Sorting} from "../common/models/sorting.enum";
import {AliasList} from "../common/models/alias-list";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ListHeaderComponent} from "../common/components/list-header/list-header.component";
import { NormalizeHelper } from "../common/normalize-helper";
import {DEFAULT_PARAMS, QueryParamHelper, QueryParams} from "../common/query-param-helper";
import {QueryFilterHelper} from "../common/query-filter-helper";
import {Logger} from "../common/logger";
import {AggregateTitleHelper} from "../common/aggregate-title-helper";
import {GroupAliasHelper} from "../common/group-alias-helper";

const MAX_CAP_DEFAULT = 200;

@Component({
  selector: 'app-albums-of-the-year',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AlbumDetailComponent,
    FormsModule,
    ReactiveFormsModule,
    ListHeaderComponent
  ],
  templateUrl: './albums-of-the-year.component.html'
})
export class AlbumsOfTheYearComponent implements OnInit {

  albumsOfTheYear! : Album[] | null;
  albumsOfTheYearWithoutMaxCap! : Album[] | null;
  rawAlbumsOfTheYear! : Album[] | null;
  aliasList!: AliasList | null;

  queryParams: QueryParams = DEFAULT_PARAMS;
  maxCap = MAX_CAP_DEFAULT;

  title = "albums of the year";
  sortingTitle = "";
  private startYear: number = 1965;
  yearOptions_ : number[] = Array.from({ length: (new Date().getFullYear() - this.startYear + 1) }, (_, i) => this.startYear + i);
  decadeOptions = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  sortingOptions = [ Sorting.RATING, Sorting.ALPHABETICAL, Sorting.ARTIST, Sorting.RELEASE_DATE, Sorting.PlAY_TIME, Sorting.RECENT ];
  artistIcon: string | undefined;

  formGroup = new FormGroup({
    search : new FormControl<string>(''),
    sorting: new FormControl<Sorting | null>(null),
    year: new FormControl<number | null>({value: null, disabled: this.yearOptions.length === 0}, Validators.required),
    rating: new FormControl<number | null>(null),
    decade: new FormControl<number | null>(null),
    category: new FormControl<string | null>(null)
  });

  private logger: Logger = new Logger(this);

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
    if (this.queryParams.decade === null) {
      return [];
    }
    return this.yearOptions_.filter(value => value >= this.queryParams.decade! && value < (this.queryParams.decade! + 10))
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
    const queryParams = QueryParamHelper.getQueryParamsFromForm(this.formGroup, resetComponent);
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
    ).then(_ => {this.logger.log("Refreshed params")});
  }


  private updateParams(params: Params) {
    this.maxCap = MAX_CAP_DEFAULT;
    this.queryParams = QueryParamHelper.aggregateParams(params);

    this.formGroup.patchValue({
      search: this.queryParams.search,
      sorting: this.queryParams.sorting,
      year: this.queryParams.year,
      decade: this.queryParams.decade,
      rating: this.queryParams.rating
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
    this.sortingTitle = AggregateTitleHelper.updateSubTitle(this.queryParams);
    albums = albums.sort((a, b) => b.rating - a.rating);
    switch (this.queryParams.sorting) {
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
    this.artistIcon = undefined;
    if (this.queryParams.year === null &&
        this.queryParams.decade === null &&
        this.queryParams.search === null &&
        this.queryParams.rating === null &&
        !this.queryParams.isReviewsOnly) {
      return albums;
    }
    this.updateTitle();
    this.updateArtistImage();
    const filteredAlbums: Album[] = [];
    for (const album of albums) {
      const isAlbumValid = QueryFilterHelper.passYearFilter(this.queryParams, album.year!) &&
          QueryFilterHelper.passDecadeFilter(this.queryParams, album.year!) &&
          QueryFilterHelper.passRatingFilter(this.queryParams, album.rating) &&
          QueryFilterHelper.passReviewOnlyFilter(this.queryParams, album.review) &&
          this.passQueryFilter(album);
      if (isAlbumValid) {
        filteredAlbums.push(album);
      }
    }
    return filteredAlbums;
  }

  private updateTitle() {
    if (this.queryParams.search !== null) {
      this.title = " albums by " + NormalizeHelper.fromQueryStringToNormal(this.queryParams.search) + "";
    }
  }

  private updateArtistImage() {
    if (this.queryParams.search === null) {
      this.artistIcon = undefined;
      return;
    }
    for (const artist of this.aliasList!.artists) {
      if (NormalizeHelper.normalize(artist.name) === NormalizeHelper.normalize(this.queryParams.search)) {
        this.artistIcon = artist.icon
        return;
      }
    }
  }

  private passQueryFilter(album: Album): boolean {
    if (this.queryParams.search === null) {
      return true;
    }
    const title = NormalizeHelper.fromNormalToQueryString(album.title);
    if (this.queryParams.isStrict && title === this.queryParams.search) {
      return true;
    }
    if (title.startsWith(this.queryParams.search)) {
      return true;
    }
    const qArtist = NormalizeHelper.fromNormalToQueryString(this.queryParams.search);
    return GroupAliasHelper.artistFilter(qArtist, this.queryParams.isStrict, album, this.aliasList!);
  }

  private getAggregatedAlbums() : Album[] {
    let aotyList = this.aotyService.getAotyList();
    const queryYears = aotyList!.items!.map(value => value.year);
    let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
    if (aotyItems == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty, routed to 404"));
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

  protected readonly Object = Object;
}
