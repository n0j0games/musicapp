import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, concatMap, forkJoin, map, Observable, of, tap} from "rxjs";
import {SotwList} from "../models/sotw-list";
import {SotwItem} from "../models/sotw-item";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
import {AotyItem} from "../models/aoty-item";
import {AotyList} from "../models/aoty-list";
import {Router} from "@angular/router";
import {AliasList} from "../models/alias-list";
import {MotyItem} from "../models/moty-item";
import {MotyService} from "./moty.service";
import {ReviewService} from "./review.service";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

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
                    console.log("Requested ALIAS list");
                    this.aotyService.setAliasList(value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
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
                    console.log("Requested SOTW list");
                    this.sotwService.setSotwList(value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
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
                    console.log("Requested SOTW item", value)
                    this.sotwService.setSongsOfTheWeek(value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchSingleAggregatedSotwItem(year : number, week : number) : Observable<SotwItem|HttpErrorResponse> {
        return this.http.get<SotwItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw/' + year + '-' + this.createWeekString(week) + '.json',
        ).pipe(
            catchError((err, caught) => of(err))
        );
    }


    fetchAggregatedSotwItems(year: number, validWeeks: number[]): Observable<(SotwItem | HttpErrorResponse)[]> {
        console.log("YEAR", year)
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
                    console.log("Requested SOTW-YEAR item", value)
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
                    console.log("Requested AOTY list");
                    this.aotyService.setAotyList(value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
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
                    console.log("Requested AOTY item", value)
                    this.aotyService.setAlbumsOfTheYear(value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
                return of(err);
            })
        );
    }

    fetchSeriesItems(): Observable<(MotyItem | HttpErrorResponse)[]> {
        const rawUrls = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const urls = rawUrls.map(url => this.fetchSingleSeriesItem(url));
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
                    console.log("Requested SERIES items", value)
                    this.motyService.setSeriesOfTheYear(value);
                }
            })
        )
    }

    fetchMotyItems(): Observable<(MotyItem | HttpErrorResponse)[]> {
        const rawUrls = [1976, 1977, 1980, 1983, 1988, 1990, 1992, 1993, 1994, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
        const urls = rawUrls.map(url => this.fetchSingleMotyItem(url));
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
                    console.log("Requested MOTY items", value)
                    this.motyService.setMoviesOfTheYear(value);
                }
            })
        )
    }

    fetchSingleMotyItem(url: number): Observable<MotyItem | HttpErrorResponse> {
        return this.http.get<MotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/movies/' + url + '.json',
        ).pipe(
            catchError((err, caught) => of(err))
        );
    }

    fetchSingleSeriesItem(url: number): Observable<MotyItem | HttpErrorResponse> {
        return this.http.get<MotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/series/' + url + '.json',
        ).pipe(
            catchError((err, caught) => of(err))
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
                    console.log("Requested AOTY-AGGREGATE item", value)
                    this.aotyService.setAggregatedAlbums(value);
                }
            })
        )
    }

    fetchSingleAggregatedAotyItem(year: number): Observable<AotyItem | HttpErrorResponse> {
        return this.http.get<AotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty/' + year + '.json',
        ).pipe(
            catchError((err, caught) => of(err))
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
                    console.log("Requested review item")
                    this.reviewService.addReview(path, value);
                }
            }),
            catchError((err, caught) => {
                this.router.navigate(['**']).then(() => console.error("Error while loading", err));
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
