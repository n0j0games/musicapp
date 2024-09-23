import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SotwService {

  private sotwList : SotwList = {};

  public sotwListChanged$ = new Subject<SotwList>();

  setSotwList(sotwList: SotwList) {
    this.sotwList = sotwList;
    this.sotwListChanged$.next(sotwList);
    console.log("set sotw list")
  }

  getSotwList() {
    return this.sotwList;
  }

}
