import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {Subject} from "rxjs";
import {SotwItem} from "../models/sotw-item";
import {AotyItem} from "../models/aoty-item";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SotwService {

  private sotwList : SotwList = {};
  private sotwItems : SotwItem[] = [];

  public sotwListChanged$ = new Subject<SotwList>();

  setSotwList(sotwList: SotwList) {
    this.sotwList = sotwList;
    this.sotwListChanged$.next(sotwList);
  }

  getSotwList(): SotwList | null {
    return this.sotwList;
  }

  getSongsOfTheYear(year : number): SotwItem[] | null {
    const aggregatedYearItems : SotwItem[] = [];
    for (const item of this.sotwItems) {
      if (item.year === year) {
        aggregatedYearItems.push(item);
      }
    }
    const weeksOfYear = this.getWeeksOfYear(year);
    console.log(weeksOfYear, aggregatedYearItems);
    if (aggregatedYearItems.length === 0 || aggregatedYearItems.length !== weeksOfYear) {
      return null;
    }
    return aggregatedYearItems;
  }

  getWeeksOfYear(year : number) : number {
    if (!this.sotwList.items) {
      return 0;
    }
    let count = 1;
    for (const item of this.sotwList.items) {
      if (parseInt(item.year.toString()) === year) {
        count++;
      }
    }
    return count;
  }

  setSongsOfTheYear(sotwItems: (SotwItem|HttpErrorResponse)[]) {
    for (const sotwItem of sotwItems) {
      const tempItem : SotwItem = <SotwItem>sotwItem;
      this.setSongsOfTheWeek(tempItem)
    }
  }

  getSongsOfWeek(week : number, year : number): SotwItem | null {
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
        return;
      }
    }
    this.sotwItems.push(sotwItem);
  }

}
