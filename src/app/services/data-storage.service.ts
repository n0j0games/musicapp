import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {SotwList} from "../models/sotw-list";
import {SotwItem} from "../models/sotw-item";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
import {AotyItem} from "../models/aoty-item";
import {AotyList} from "../models/aoty-list";

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
                    console.log("Requested SOTW item", value)
                    this.aotyService.setAlbumsOfTheYear(value);
                }
            })
        );
    }


}
