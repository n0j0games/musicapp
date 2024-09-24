import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {Subject} from "rxjs";
import {SotwItem} from "../models/sotw-item";

@Injectable({
  providedIn: 'root'
})
export class SotwService {

  private sotwList : SotwList = {};
  private sotwItems : SotwItem[] = [];

  public sotwListChanged$ = new Subject<SotwList>();
  public songsOfTheWeekChanged$ = new Subject<SotwItem>();

  setSotwList(sotwList: SotwList) {
    this.sotwList = sotwList;
    this.sotwListChanged$.next(sotwList);
    console.log("set sotw list")
  }

  getSotwList(): SotwList | null {
    return this.sotwList;
  }

  getSongsOfWeek(week : number, year : number): SotwItem | null {
    console.log(this.sotwItems, week, year);
    for (const item of this.sotwItems) {
      if (item.week == week && item.year == year) {
        return item;
      }
    }
    return null;
  }

  setSongsOfTheWeek(sotwItem: SotwItem) {
    for (const item of this.sotwItems) {
      if (item.week === sotwItem.week && item.year === sotwItem.year) {
        console.log("Item already existed");
        return;
      }
    }
    this.sotwItems.push(sotwItem);
    this.songsOfTheWeekChanged$.next(sotwItem);
    console.log("add sotw item", sotwItem, this.sotwItems);
  }

}
