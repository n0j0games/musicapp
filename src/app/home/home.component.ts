import {Component, OnInit} from '@angular/core';
import {LowerCasePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../common/services/sotw.service";
import {SotwList} from "../common/models/sotw-list";
import {AotyService} from "../common/services/aoty.service";
import {AotyList} from "../common/models/aoty-list";
import {ItemComponent} from "./item-group/item/item.component";
import {ItemGroupComponent} from "./item-group/item-group.component";
import {AotyItem} from "../common/models/aoty-item";
import {ReactiveFormsModule} from "@angular/forms";
import {HomeSpecialComponent} from "./home-special/home-special.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    ItemComponent,
    ItemGroupComponent,
    NgIf,
    LowerCasePipe,
    ReactiveFormsModule,
    HomeSpecialComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  aotyListsGroupedByDecade! : {items : { year : number, week? : number, preview? : string[] }[], decade : number }[];
  aotyListsWithoutDecade!: { year : number, week? : number, preview? : string[] }[];
  sotwListsGroupedByYear! : {items : { year : number, week? : number, preview? : string[] }[], decade : null }[];

  constructor(private sotwService: SotwService,
              private aotyService: AotyService) {}

  ngOnInit() {
    this.setSotyList();
    this.setAotyList();
  }

  private setSotyList() {
    let sotwList : SotwList | null = this.sotwService.getSotwList();
    if (sotwList === null || sotwList.items === undefined) {
      console.error("SotwList was undefined, try to wait for list change")
      this.sotwService.sotwListChanged$.subscribe({
        next: (v) => {
          sotwList = v
          if (sotwList.items !== undefined) {
            sotwList.items = sotwList.items.sort((a, b) => b.week - a.week);
          }
        },
        error: (e) => console.error(e)
      })
      return;
    }
    sotwList.items = sotwList.items.sort((a, b) => b.week - a.week);
    if (sotwList.years === undefined) {
      console.error("Years was undefined");
      return;
    }

    this.sotwListsGroupedByYear = [];
    for (const year of sotwList.years) {
      const items : { year : number, week?: number, preview? : string[] }[] = [];
      for (const item of sotwList.items) {
        if (parseInt(item.year.toString()) === year) {
          items.push(item);
        }
      }
      this.sotwListsGroupedByYear.push({ items: items, decade : null });
    }
    this.sotwListsGroupedByYear.sort((a, b) => b.items[0].year - a.items[0].year);

  }

  private setAotyList() {
    let aotyList : AotyList | null = this.aotyService.getAotyList();
    if (aotyList === null || aotyList.items === undefined) {
      console.error("AotyList was undefined, try to wait for list change")
      this.aotyService.aotyListChanged$.subscribe({
        next: (v) => {
          aotyList = v
          if (aotyList.items !== undefined) {
            aotyList.items = aotyList.items.sort((a, b) => b.year - a.year);
          }
        },
        error: (e) => console.error(e)
      })
      return;
    }
    aotyList.items = aotyList.items.sort((a, b) => b.year - a.year);

    if (aotyList.decades === undefined) {
      console.error("Decades was undefined");
      return;
    }
    this.aotyListsGroupedByDecade = [];
    this.aotyListsWithoutDecade = [];
    for (const decade of aotyList.decades) {
      const items : { year : number, decade? : number, preview? : string[] }[] = [];
      for (const item of aotyList.items) {
        if (item.year - decade >= 0 && item.year - decade < 10) {
          items.push(item);
        }
      }
      const t : { year : number, week? : number, preview? : string[]}[] = items.map((value : { year : number, decade? : number, preview? : string[] }) => {
        return { year : value.year, week : undefined, preview : value.preview ? value.preview : undefined };
      });
      this.aotyListsGroupedByDecade.push({ items: t, decade: decade });
    }
    for (const decade of [1960, 1970, 1980, 1990, 2000]) {
      for (const item of aotyList.items) {
        if (item.year === decade) {
          this.aotyListsWithoutDecade.push(item);
        }
      }
    }
    this.aotyListsWithoutDecade.sort((a, b) => b.year - a.year);
    this.aotyListsGroupedByDecade.sort((a, b) => b.decade - a.decade);
  }

  protected readonly AotyItem = AotyItem;
}

