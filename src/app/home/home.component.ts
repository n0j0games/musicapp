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

  sotwList! : SotwList | null;
  aotyListsGroupedByDecade! : {items : { year : number, week? : number, preview? : string[] }[], decade : number }[];

  constructor(private sotwService: SotwService,
              private aotyService: AotyService) {}

  ngOnInit() {
    this.setSotyList();
    this.setAotyList();
  }

  private setSotyList() {
    this.sotwList = this.sotwService.getSotwList();
    if (this.sotwList === null || this.sotwList.items === undefined) {
      console.error("SotwList was undefined, try to wait for list change")
      this.sotwService.sotwListChanged$.subscribe({
        next: (v) => {
          this.sotwList = v
          if (this.sotwList.items !== undefined) {
            this.sotwList.items = this.sotwList.items.sort((a, b) => b.week - a.week);
          }
        },
        error: (e) => console.log(e)
      })
      return;
    }
    this.sotwList.items = this.sotwList.items.sort((a, b) => b.week - a.week);
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
