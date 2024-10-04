import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SotwList} from "../models/sotw-list";
import {WeekHelper} from "../common/week-helper";
import {AotyService} from "../services/aoty.service";
import {AotyList} from "../models/aoty-list";
import {ItemComponent} from "./item-group/item/item.component";
import {ItemGroupComponent} from "./item-group/item-group.component";
import {AotyItem} from "../models/aoty-item";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    ItemComponent,
    ItemGroupComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  aotyListsGroupedByDecade! : {items : { year : number, week? : number, preview? : string[] }[], decade : number }[];
  sotwListsGroupedByYear! : {items : { year : number, week? : number, preview? : string[] }[], decade : null }[];

  constructor(private sotwService: SotwService,
              private aotyService: AotyService) {}

  ngOnInit() {
    this.setSotyList();
    this.setAotyList();
  }

  private setSotyList() {
    let sotwList : SotwList | null = this.sotwService.getSotwList();
    console.log(sotwList)
    if (sotwList === null || sotwList.items === undefined) {
      console.error("SotwList was undefined, try to wait for list change")
      this.sotwService.sotwListChanged$.subscribe({
        next: (v) => {
          sotwList = v
          if (sotwList.items !== undefined) {
            sotwList.items = sotwList.items.sort((a, b) => b.week - a.week);
          }
        },
        error: (e) => console.log(e)
      })
      return;
    }
    sotwList.items = sotwList.items.sort((a, b) => b.week - a.week);
    console.log(sotwList.items);
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
    console.log(this.sotwListsGroupedByYear);
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
        error: (e) => console.log(e)
      })
      return;
    }
    aotyList.items = aotyList.items.sort((a, b) => b.year - a.year);

    if (aotyList.decades === undefined) {
      console.error("Decades was undefined");
      return;
    }
    this.aotyListsGroupedByDecade = [];
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
    this.aotyListsGroupedByDecade.sort((a, b) => b.decade - a.decade);
  }

}
