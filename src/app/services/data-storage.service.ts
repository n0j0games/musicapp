import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, concatMap, forkJoin, map, Observable, of, tap} from "rxjs";
import {SotwList} from "../models/sotw-list";
import {SotwItem} from "../models/sotw-item";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
import {AotyItem} from "../models/aoty-item";
import {AotyList} from "../models/aoty-list";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(private http: HttpClient,
                private sotwService: SotwService,
                private aotyService: AotyService,
                private router: Router) {
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
                this.router.navigate(['**']).then(() => console.error("Error while loading"));
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
                this.router.navigate(['**']).then(() => console.error("Error while loading"));
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
        const urls = validWeeks.map(week => this.fetchSingleAggregatedSotwItem(year, week));
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
                this.router.navigate(['**']).then(() => console.error("Error while loading"));
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
                this.router.navigate(['**']).then(() => console.error("Error while loading"));
                return of(err);
            })
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

    private createWeekString (week : number) : string {
        const weekStr = week.toString();
        if (weekStr.length === 1) {
            return "0" + weekStr;
        } else {
            return weekStr;
        }
    }

}
