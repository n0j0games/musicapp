import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, of, tap} from "rxjs";
import {SotwList} from "../../songs-of-the-week/models/sotw-list";
import {SotwItem} from "../../songs-of-the-week/models/sotw-item";
import {SotwService} from "../../songs-of-the-week/services/sotw.service";
import {AotyService} from "../../albums-of-the-year/services/aoty.service";
import {AotyItem} from "../../albums-of-the-year/models/aoty-item";
import {AotyList} from "../../albums-of-the-year/models/aoty-list";
import {Router} from "@angular/router";
import {AliasList} from "../../albums-of-the-year/models/alias-list";
import {MotyItem} from "../../shows-of-the-year/models/moty-item";
import {MotyService} from "../../shows-of-the-year/services/moty.service";
import {ReviewService} from "./review.service";
import {Logger} from "../utils/logger";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    private logger: Logger = new Logger("DataStorageService");

    constructor(private http: HttpClient,
                private sotwService: SotwService,
                private aotyService: AotyService,
                private motyService : MotyService,
                private router: Router,
                private reviewService: ReviewService) {
    }

    fetchAliasList(): Observable<AliasList> {
        return this.http.get<AliasList>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/artists.json',
        ).pipe(
            tap((value: AliasList) => {
                if (value != null) {
                    this.logger.log("Requested ALIAS list");
                    this.aotyService.setAliasList(value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchSotwList(): Observable<SotwList> {
        return this.http.get<SotwList>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw-list.json',
        ).pipe(
            tap((value: SotwList) => {
                if (value != null) {
                    this.logger.log("Requested SOTW list");
                    this.sotwService.setSotwList(value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchSotwItem(week: number, year: number): Observable<SotwItem> {
        return this.http.get<SotwItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw/' + year + '-' + this.createWeekString(week) + '.json',
        ).pipe(
            tap((value: SotwItem) => {
                if (value != null) {
                    this.logger.log("Requested SOTW item", value)
                    this.sotwService.setSongsOfTheWeek(value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchSingleAggregatedSotwItem(year : number, week : number) : Observable<SotwItem|HttpErrorResponse> {
        return this.http.get<SotwItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw/' + year + '-' + this.createWeekString(week) + '.json',
        ).pipe(
            catchError((err, _) => of(err))
        );
    }


    fetchAggregatedSotwItems(year: number, validWeeks: number[]): Observable<(SotwItem | HttpErrorResponse)[]> {
        const urls = year === 0 ?
            [this.fetchSingleAggregatedSotwItem(0, 0)] :
            validWeeks.map(week => this.fetchSingleAggregatedSotwItem(year, week));
        return forkJoin<(SotwItem | HttpErrorResponse)[]>(urls).pipe(
            map((value: (SotwItem | HttpErrorResponse)[]) => {
                const res: (SotwItem | HttpErrorResponse)[] = [];
                for (const item of value) {
                    if (!(item instanceof HttpErrorResponse)) {
                        res.push(item)
                    }
                }
                return res;
            }),
            tap((value: (SotwItem | HttpErrorResponse)[]) => {
                if (value != null) {
                    this.logger.log("Requested SOTW-YEAR item", value)
                    this.sotwService.setSongsOfTheYear(value);
                }
            })
        )
    }

    fetchAotyList(): Observable<AotyList> {
        return this.http.get<AotyList>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty-list.json',
        ).pipe(
            tap((value: AotyList) => {
                if (value != null) {
                    this.logger.log("Requested AOTY list");
                    this.aotyService.setAotyList(value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchAotyItem(year: number): Observable<AotyItem> {
        return this.http.get<AotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty/' + year + '.json',
        ).pipe(
            tap((value: AotyItem) => {
                if (value != null) {
                    this.logger.log("Requested AOTY item", value)
                    this.aotyService.setAlbumsOfTheYear(value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }


    fetchMotyItems(): Observable<(MotyItem | HttpErrorResponse)[]> {
        const movieUrls = [1976, 1977, 1980, 1983, 1988, 1990, 1992, 1993, 1994, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const seriesUrls = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const urls = movieUrls.map(url => this.fetchSingleMotyItem(url, 'movies')).concat(seriesUrls.map(url => this.fetchSingleMotyItem(url, 'series')));
        return forkJoin<(MotyItem | HttpErrorResponse)[]>(urls).pipe(
            map((value: (MotyItem | HttpErrorResponse)[]) => {
                const res: (MotyItem | HttpErrorResponse)[] = [];
                for (const item of value) {
                    if (!(item instanceof HttpErrorResponse)) {
                        res.push(item)
                    }
                }
                return res;
            }),
            tap((value: (MotyItem | HttpErrorResponse)[]) => {
                if (value != null) {
                    this.logger.log("Requested MOTY items", value)
                    this.motyService.setAllMoviesAndShows(value);
                }
            })
        )
    }

    fetchSingleMotyItem(url: number, type: string): Observable<MotyItem | HttpErrorResponse> {
        return this.http.get<MotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/' + type + '/' + url + '.json',
        ).pipe(
            catchError((err, _) => of(err))
        );
    }

    fetchAggregatedAotyItems(validYears: number[]): Observable<(AotyItem | HttpErrorResponse)[]> {
        const urls = validYears.map(year => this.fetchSingleAggregatedAotyItem(year));
        return forkJoin<(AotyItem | HttpErrorResponse)[]>(urls).pipe(
            map((value: (AotyItem | HttpErrorResponse)[]) => {
                const res: (AotyItem | HttpErrorResponse)[] = [];
                for (const item of value) {
                    if (!(item instanceof HttpErrorResponse)) {
                        res.push(item)
                    }
                }
                return res;
            }),
            tap((value: (AotyItem | HttpErrorResponse)[]) => {
                if (value != null) {
                    this.logger.log("Requested AOTY-AGGREGATE item", value)
                    this.aotyService.setAggregatedAlbums(value);
                }
            })
        )
    }

    fetchSingleAggregatedAotyItem(year: number): Observable<AotyItem | HttpErrorResponse> {
        return this.http.get<AotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty/' + year + '.json',
        ).pipe(
            catchError((err, _) => of(err))
        );
    }

    fetchReview(path: string): Observable<string> {
        return this.http.get(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/reviews/' + path + '.txt',
            {
                responseType: 'text'
            }
        ).pipe(
            tap((value: string) => {
                if (value != null) {
                    this.logger.log("Requested review item")
                    this.reviewService.addReview(path, value);
                }
            }),
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            })
        );
    }

    private createWeekString (week : number) : string {
        const weekStr = week.toString();
        if (weekStr.length === 1) {
            return "0" + weekStr;
        } else {
            return weekStr;
        }
    }

}
