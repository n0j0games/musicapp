import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {Subject} from "rxjs";
import {SotwItem} from "../models/sotw-item";
import {AotyItem} from "../models/aoty-item";

@Injectable({
  providedIn: 'root'
})
export class AotyService {

  private aotyList : { items? : number[] } = {};
  private aotyItems : AotyItem[] = [];

  public aotyListChanged$ = new Subject<{ items : number[] }>();
  public albumOfTheYearsChanged$ = new Subject<AotyItem>();

  setAotyList(aotyList: { items : number[] }) {
    this.aotyList = aotyList;
    this.aotyListChanged$.next(aotyList);
    console.log("set aoty list")
  }

  getAotyList(): { items? : number[] } | null {
    return this.aotyList;
  }

  getAlbumsOfTheYear(year : number): AotyItem | null {
    console.log(this.aotyItems, year);
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
        console.log("Item already existed");
        return;
      }
    }
    this.aotyItems.push(aotyItem);
    this.albumOfTheYearsChanged$.next(aotyItem);
    console.log("add sotw item", aotyItem, this.aotyItems);
  }

}
