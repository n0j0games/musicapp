import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {Subject} from "rxjs";
import {SotwItem} from "../models/sotw-item";
import {AotyItem} from "../models/aoty-item";
import {AotyList} from "../models/aoty-list";
import {Album} from "../models/album";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AotyService {

  private aotyList : AotyList = {};
  private aotyItems : AotyItem[] = [];

  public aotyListChanged$ = new Subject<AotyList>();

  setAotyList(aotyList: AotyList) {
    this.aotyList = aotyList;
    this.aotyListChanged$.next(aotyList);
  }

  getAotyList(): AotyList | null {
    return this.aotyList;
  }

  getAggregatedAlbums(queryYears : number[]) : AotyItem[] | null {
    queryYears = queryYears.filter(year => year >= 2010 || year % 10 == 0);
    const aggregatedAlbums : AotyItem[] = [];
    for (const item of this.aotyItems) {
      if (queryYears.includes(item.year)) {
        aggregatedAlbums.push(item);
      }
    }
    if (aggregatedAlbums.length === 0 || aggregatedAlbums.length !== queryYears.length) {
      return null;
    }
    return aggregatedAlbums;
  }

  getAlbumsOfTheDecade(decade : number): AotyItem[] | null {
    const aggregatedDecadeAlbums : AotyItem[] = [];
    for (const item of this.aotyItems) {
      if (item.year - decade >= 0 && item.year - decade < 10) {
        aggregatedDecadeAlbums.push(item);
      }
    }
    const yearsInDecade = this.getYearsInDecade(decade);
    if (aggregatedDecadeAlbums.length === 0 || aggregatedDecadeAlbums.length !== yearsInDecade) {
      return null;
    }
    return aggregatedDecadeAlbums;
  }

  getYearsInDecade(decade : number) : number {
    if (!this.aotyList.items) {
      return 0;
    }
    let count = 0;
    for (const item of this.aotyList.items) {
      if (item.year - decade >= 0 && item.year - decade < 10) {
        count++;
      }
    }
    return count;
  }

  setAggregatedAlbums(aotyItems: (AotyItem|HttpErrorResponse)[]) {
    for (const aotyItem of aotyItems) {
      const tempItem : AotyItem = <AotyItem>aotyItem;
      this.setAlbumsOfTheYear(tempItem)
    }
  }

  getAlbumsOfTheYear(year : number): AotyItem | null {
    for (const item of this.aotyItems) {
      if (item.year == year) {
        return item;
      }
    }
    return null;
  }

  setAlbumsOfTheYear(aotyItem: AotyItem) {
    for (const item of this.aotyItems) {
      if (item.year === aotyItem.year) {
        return;
      }
    }
    this.aotyItems.push(aotyItem);
  }

}
