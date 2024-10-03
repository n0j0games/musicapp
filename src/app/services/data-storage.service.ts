import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, concatMap, forkJoin, map, Observable, of, tap} from "rxjs";
import {SotwList} from "../models/sotw-list";
import {SotwItem} from "../models/sotw-item";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
import {AotyItem} from "../models/aoty-item";
import {AotyList} from "../models/aoty-list";
import {Album} from "../models/album";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

    constructor(private http : HttpClient,
                private sotwService : SotwService,
                private aotyService : AotyService) { }


    fetchSotwList() : Observable<SotwList> {
    return this.http.get<SotwList>(
      'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw-list.json',
    ).pipe(
        tap((value : SotwList) => {
            if (value != null) {
            console.log("Requested SOTW list");
            this.sotwService.setSotwList(value);
            }
        })
    );
    }

    fetchSotwItem(week : number, year : number) : Observable<SotwItem> {
    return this.http.get<SotwItem>(
       'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/sotw/' + year + '-' + week + '.json',
    ).pipe(
        tap((value : SotwItem) => {
          if (value != null) {
            console.log("Requested SOTW item", value)
            this.sotwService.setSongsOfTheWeek(value);
          }
        })
    );
    }

    fetchAotyList() : Observable<AotyList> {
        return this.http.get<AotyList>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty-list.json',
        ).pipe(
            tap((value : AotyList) => {
                if (value != null) {
                    console.log("Requested AOTY list");
                    this.aotyService.setAotyList(value);
                }
            })
        );
    }

    fetchAotyItem(year : number) : Observable<AotyItem> {
        return this.http.get<AotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty/' + year + '.json',
        ).pipe(
            tap((value : AotyItem) => {
                if (value != null) {
                    console.log("Requested AOTY item", value)
                    this.aotyService.setAlbumsOfTheYear(value);
                }
            })
        );
    }

    fetchAggregatedAotyItems(validYears: number[]) : Observable<(AotyItem|HttpErrorResponse)[]> {
        const urls = validYears.map(year => this.fetchSingleAggregatedAotyItem(year));
        return forkJoin<(AotyItem | HttpErrorResponse)[]>(urls).pipe(
            map((value : (AotyItem | HttpErrorResponse)[]) => {
                const res : (AotyItem|HttpErrorResponse)[] = [];
                for (const item of value) {
                    if (!(item instanceof HttpErrorResponse)) {
                        res.push(item)
                    }
                }
                return res;
            }),
            tap((value : (AotyItem|HttpErrorResponse)[]) => {
                if (value != null) {
                    console.log("Requested AOTY-DECADE item", value)
                    this.aotyService.setAlbumsOfTheDecade(value);
                }
            })
        )
    }

    fetchSingleAggregatedAotyItem(year : number) : Observable<AotyItem|HttpErrorResponse> {
        return this.http.get<AotyItem>(
            'https://raw.githubusercontent.com/n0j0games/musicapp/refs/heads/main/data/aoty/' + year + '.json',
        ).pipe(
            catchError((err, caught) => of(err))
        );
    }

}
