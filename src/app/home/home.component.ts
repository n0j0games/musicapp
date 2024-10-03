import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SotwList} from "../models/sotw-list";
import {WeekHelper} from "../common/week-helper";
import {AotyService} from "../services/aoty.service";
import {AotyList} from "../models/aoty-list";
import {ItemComponent} from "./item/item.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    ItemComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  sotwList! : SotwList | null;
  aotyList! : AotyList | null;

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
    this.aotyList = this.aotyService.getAotyList();
    if (this.aotyList === null || this.aotyList.items === undefined) {
      console.error("AotyList was undefined, try to wait for list change")
      this.aotyService.aotyListChanged$.subscribe({
        next: (v) => {
          this.aotyList = v
          if (this.aotyList.items !== undefined) {
            this.aotyList.items = this.aotyList.items.sort((a, b) => b.year - a.year);
          }
        },
        error: (e) => console.log(e)
      })
      return;
    }
    this.aotyList.items = this.aotyList.items.sort((a, b) => b.year - a.year);
    console.log("AOTYLIST", this.aotyList.items)
  }

}
