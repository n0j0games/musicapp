import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {AlbumDetailComponent} from "./album-detail/album-detail.component";
import {Album} from "./models/album";
import {Sorting} from "../common/utils/sorting.enum";
import {AliasList} from "./models/alias-list";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ListHeaderComponent} from "../common/components/list-header/list-header.component";
import {NormalizeHelper} from "../common/utils/normalize-helper";
import {QueryParamHelper, QueryParams} from "../common/utils/query-param-helper";
import {QueryFilterHelper} from "../common/utils/query-filter-helper";
import {Logger} from "../common/utils/logger";
import {AggregateTitleHelper} from "../common/utils/aggregate-title-helper";
import {GroupAliasHelper} from "../common/utils/group-alias-helper";
import {SearchCategory} from "../common/utils/search-category.enum";
import {AotyService} from "./services/aoty.service";
import {concatMap, first, map} from "rxjs";
import {AotyResponse} from "./models/aoty-response";

const MAX_CAP_DEFAULT = 70;

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
export class AlbumsOfTheYearComponent {

  albumsOfTheYear! : Album[] | null;
  albumsOfTheYearWithoutMaxCap! : Album[] | null;
  aliasList!: AliasList | null;

  loading: boolean = true;

  queryParams: QueryParams = QueryParamHelper.DEFAULT_PARAMS;
  maxCap = MAX_CAP_DEFAULT;

  title = "albums of the year";
  sortingTitle = "";
  private startYear: number = 1965;
  yearOptions_ : number[] = Array.from({ length: (new Date().getFullYear() - this.startYear + 1) }, (_, i) => this.startYear + i);
  decadeOptions = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
  sortingOptions = [ Sorting.RATING, Sorting.ALPHABETICAL, Sorting.ARTIST, Sorting.RELEASE_DATE, Sorting.PlAY_TIME, Sorting.RECENT, Sorting.RECENTLY_LOGGED ];
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

  constructor(private route: ActivatedRoute, private router: Router, private aotyService : AotyService) {
    this.route.queryParams.subscribe(params => {
      this.reset();
      this.updateParams(params);
      this.albumsOfTheYear = [];
      this.aotyService.getAliasList().pipe(
          first(),
          concatMap(alias => {
            return this.aotyService.searchAotyItems(this.queryParams).pipe(
                map((albums): [AliasList, AotyResponse] => [alias, albums])
            );
          }),
      ).subscribe(([alias, albums]) => {
        this.aliasList = alias;
        this.refreshAlbums(albums);
        this.loading = false;
      });
    });
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
  }

  private cutAlbums(): void {
    if (!this.albumsOfTheYearWithoutMaxCap || this.albumsOfTheYearWithoutMaxCap.length === 0) {
      this.albumsOfTheYear = [];
      return;
    }
    this.albumsOfTheYear = [...this.albumsOfTheYearWithoutMaxCap].slice(0, this.maxCap < this.albumsOfTheYearWithoutMaxCap.length ? this.maxCap : this.albumsOfTheYearWithoutMaxCap.length);
  }

  private reset(): void {
    this.albumsOfTheYear = [];
    this.albumsOfTheYearWithoutMaxCap = [];
    this.loading = true;
    this.cutAlbums();
  }

  private refreshAlbums(aotyResponse: AotyResponse): void {
    if (aotyResponse.albums.length === 0) {
      this.cutAlbums();
      return;
    }
    this.updateMeta(aotyResponse);
    this.albumsOfTheYearWithoutMaxCap = aotyResponse.albums;
    this.cutAlbums();
  }

  private updateSubtitle(): void {
    this.sortingTitle = AggregateTitleHelper.updateSubTitle(this.queryParams);
    switch (this.queryParams.sorting) {
      case Sorting.ALPHABETICAL:
        this.sortingTitle = "sorted alphabetically by title";
        break;
      case Sorting.ARTIST:
        this.sortingTitle = "sorted alphabetically by artist";
        break;
      case Sorting.PlAY_TIME:
        this.sortingTitle = "sorted by playtime";
        break;
      case Sorting.RECENT:
        this.sortingTitle = "sorted by recent playtime";
        break;
      default:
        break;
    }
  }

  private updateMeta(aotyResponse: AotyResponse): void {
    this.title = "all albums i've listened to";
    this.artistIcon = undefined;
    if (aotyResponse.artist) {
      this.artistIcon = aotyResponse.artist.icon;
    }
    this.updateTitle();
    this.updateSubtitle();
  }

  private updateTitle() {
    if (this.queryParams.search !== null) {
      if (this.queryParams.searchCategory === SearchCategory.ARTISTS) {
        this.title = " albums by " + NormalizeHelper.fromQueryStringToNormal(this.queryParams.search);
      } else {
        this.title = " albums matching '" + NormalizeHelper.fromQueryStringToNormal(this.queryParams.search) + "'";
      }
    }
  }

  protected readonly Object = Object;
}
