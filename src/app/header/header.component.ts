import {Component, OnInit} from '@angular/core';
import {WeekHelper} from "../common/week-helper";
import {Router, RouterLink} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SotwList} from "../models/sotw-list";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router, private sotwService : SotwService) {
  }

  private weekHelper = new WeekHelper();
  currentYear : number = new Date().getFullYear();
  currentWeek : number = this.weekHelper.getCurrentDateWeek();

  ngOnInit() {

    const sotwList = this.sotwService.getSotwList();
    if (sotwList === null || sotwList.items === undefined) {
      this.sotwService.sotwListChanged$.subscribe({
        next: (v) => {
          this.setCurrentWeek(v);
        },
        error: (e) => console.error(e)
      })
      return;
    }
    this.setCurrentWeek(sotwList);
  }

  private setCurrentWeek(sotwList : SotwList) {
    if (sotwList.items !== undefined) {
      const sotwItems = sotwList.items.sort((a, b) => b.week - a.week);
      this.currentWeek = sotwItems[0].week;
    }
  }
}
