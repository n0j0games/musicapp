import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {SotwList} from "../models/sotw-list";
import {SotwItem} from "../models/sotw-item";
import {SotwService} from "./sotw.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http : HttpClient,
              private sotwService : SotwService) { }


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
            console.log("Requested SOTW item")
            this.sotwService.setSongsOfTheWeek(value);
          }
        })
    );
  }

}
