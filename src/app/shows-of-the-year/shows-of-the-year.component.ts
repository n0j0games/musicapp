import {Component, OnInit} from '@angular/core';
import {AlbumDetailComponent} from "../albums-of-the-year/album-detail/album-detail.component";
import {ListHeaderComponent} from "../common/components/list-header/list-header.component";
import {NgForOf, NgIf} from "@angular/common";
import {Movie} from "../common/models/movie";
import {
  DEFAULT_PARAMS_WITH_CATEGORY,
  QueryParamHelper,
  QueryParams
} from "../common/query-param-helper";
import {Sorting} from "../common/models/sorting.enum";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Logger} from "../common/logger";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MotyService} from "../common/services/moty.service";
import {QueryFilterHelper} from "../common/query-filter-helper";
import {NormalizeHelper} from "../common/normalize-helper";
import {ShowDetailComponent} from "./show-detail/show-detail.component";
import {AggregateTitleHelper} from "../common/aggregate-title-helper";

const MAX_CAP_DEFAULT = 200;

@Component({
  selector: 'app-shows-of-the-year',
  standalone: true,
  imports: [
    AlbumDetailComponent,
    ListHeaderComponent,
    NgForOf,
    NgIf,
    ShowDetailComponent
  ],
  templateUrl: './shows-of-the-year.component.html'
})
export class ShowsOfTheYearComponent implements OnInit {

  showsOfTheYear!: Movie[] | null;
  showsOfTheYearWithoutMaxCap!: Movie[] | null;
  rawShowsOfTheYear! : Movie[] | null;

  queryParams: QueryParams = DEFAULT_PARAMS_WITH_CATEGORY;
  maxCap = MAX_CAP_DEFAULT;

  title = "movies & shows of the year";
  sortingTitle = "";
  private startYear: number = 1976;
  yearOptions_ : number[] = Array.from({ length: (new Date().getFullYear() - this.startYear + 1) }, (_, i) => this.startYear + i);
  decadeOptions = [1970, 1980, 1990, 2000, 2010, 2020];
  sortingOptions = [ Sorting.RATING, Sorting.ALPHABETICAL, Sorting.DIRECTOR, Sorting.RELEASE_DATE ]

  formGroup = new FormGroup({
    search : new FormControl<string>(''),
    sorting: new FormControl<Sorting | null>(null),
    year: new FormControl<number | null>({value: null, disabled: this.yearOptions.length === 0}, Validators.required),
    rating: new FormControl<number | null>(null),
    decade: new FormControl<number | null>(null),
    category: new FormControl<string | null>(null)
  });

  private logger: Logger = new Logger(this);

  constructor(private route: ActivatedRoute, private router: Router, private motyService : MotyService) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.updateParams(params);
    })

    this.rawShowsOfTheYear = this.getAggregatedMovies();
    this.showsOfTheYearWithoutMaxCap = [...this.rawShowsOfTheYear];
    this.refreshShows();
  }

  get yearOptions() {
    if (this.queryParams.decade === null) {
      return [];
    }
    return this.yearOptions_.filter(value => value >= this.queryParams.decade! && value < (this.queryParams.decade! + 10))
  }

  loadMore() {
    this.maxCap = this.maxCap + MAX_CAP_DEFAULT;
    this.cutShows();
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

  private navigateAfterFormChange(queryParams: Params) {
    this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'replace'
        }
    ).then(_ => { this.logger.log("Refreshed params") });
  }

  private updateParams(params: Params) {
    this.maxCap = MAX_CAP_DEFAULT;
    this.queryParams = QueryParamHelper.aggregateParams(params);

    this.formGroup.patchValue({
      search: this.queryParams.search,
      sorting: this.queryParams.sorting,
      year: this.queryParams.year,
      decade: this.queryParams.decade,
      rating: this.queryParams.rating,
      category: this.queryParams.category
    });
    if (this.yearOptions.length > 0) {
      this.formGroup.controls.year.enable();
    } else {
      this.formGroup.controls.year.disable();
    }
    this.refreshShows();
  }

  private cutShows(): void {
    if (!this.showsOfTheYearWithoutMaxCap || this.showsOfTheYearWithoutMaxCap.length === 0) {
      this.showsOfTheYear = [];
      return;
    }
    this.showsOfTheYear = [...this.showsOfTheYearWithoutMaxCap].slice(0, this.maxCap < this.showsOfTheYearWithoutMaxCap.length ? this.maxCap : this.showsOfTheYearWithoutMaxCap.length);
  }

  private refreshShows(): void {
    if (!this.rawShowsOfTheYear || this.rawShowsOfTheYear.length === 0) {
      this.cutShows();
      return;
    }
    this.title = "";
    const showCopy : Movie[] = [...this.rawShowsOfTheYear];
    const filteredShows = this.filterShows(showCopy);
    this.showsOfTheYearWithoutMaxCap = this.sortShows(filteredShows);
    this.cutShows();
  }

  private sortShows(shows: Movie[]): Movie[] {
    this.sortingTitle = AggregateTitleHelper.updateSubTitle(this.queryParams);
    shows = shows.sort((a, b) => b.rating - a.rating);
    switch (this.queryParams.sorting) {
      case Sorting.ALPHABETICAL:
        this.sortingTitle = "sorted alphabetically by title";
        return shows.sort((a, b) => a.title.localeCompare(b.title));
      case Sorting.DIRECTOR:
        this.sortingTitle = "sorted alphabetically by director";
        return shows.filter(value => value.creator !== undefined).sort((a, b) => a.creator!.localeCompare(b.creator!));
      case Sorting.RATING:
        return shows.sort((a, b) => b.rating - a.rating);
      case Sorting.RELEASE_DATE:
        return shows.sort((a, b) => (a.year ? a.year : 9999) - (b.year ? b.year : 9999));
      default:
        return shows;
    }
  }

  private filterShows(shows: Movie[]): Movie[] {
    this.title = "all movies & shows i've watched";
    if (this.queryParams.category === null &&
        this.queryParams.year === null &&
        this.queryParams.decade === null &&
        this.queryParams.search === null &&
        this.queryParams.rating === null &&
        !this.queryParams.isReviewsOnly) {
      return shows;
    }
    this.updateTitle();
    const filteredShows: Movie[] = [];
    for (const show of shows) {
      const isAlbumValid = QueryFilterHelper.passYearFilter(this.queryParams, show.year!) &&
          QueryFilterHelper.passDecadeFilter(this.queryParams, show.year!) &&
          QueryFilterHelper.passRatingFilter(this.queryParams, show.rating) &&
          QueryFilterHelper.passCategoryFilter(this.queryParams, show.seasonHref) &&
          this.passQueryFilter(show);
      if (isAlbumValid) {
        filteredShows.push(show);
      }
    }
    return filteredShows;
  }

  private updateTitle() {
    const moviesAndShows = !this.queryParams.category || this.queryParams.category === 'all' ? 'movies & shows' : this.queryParams.category;
    if (this.queryParams.search !== null) {
      this.title = " " + moviesAndShows + " matching '" + this.queryParams.search.replace("-", " ") + "'";
    } else {
      this.title = "all " + moviesAndShows + " i've watched";
    }
  }

  private passQueryFilter(movie: Movie): boolean {
    if (this.queryParams.search === null) {
      return true;
    }

    const title = NormalizeHelper.fromNormalToQueryString(movie.title);
    const query = NormalizeHelper.fromNormalToQueryString(this.queryParams.search);
    if (query.includes(title) || title.includes(query)) {
      this.logger.debug("Title includes query", title, query);
      return true;
    }
    if (movie.creator) {
      const director = NormalizeHelper.fromNormalToQueryString(movie.creator);
      if (director.includes(query) || query.includes(director)) {
        this.logger.debug("Director includes query", director, query);
        return true;
      }
    }
    const franchises = movie.franchises?.map(franchise => NormalizeHelper.fromNormalToQueryString(franchise));
    if (franchises === undefined) {
      this.logger.debug("Title not included in query", title, query);
      return false;
    }
    for (const franchise of franchises) {
      if (franchise.includes(query) || query.includes(franchise)) {
        this.logger.debug("Franchise includes query", franchise, query);
        return true;
      }
    }
    this.logger.debug("Title not included in query", title, query);
    return false;
  }

  private getAggregatedMovies() : Movie[] {
    let motyItems = this.motyService.getAllMoviesAndShows();
    if (motyItems == null) {
      this.router.navigate(['**']).then(() => this.logger.error("Empty, routed to 404"));
      return [];
    }
    let movies : Movie[] = [];
    for (const item of motyItems) {
      const movies_ = item.items.slice();
      movies = movies.concat(movies_);
    }
    return movies;
  }

}
