import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {WeekHelper} from "../../../common/week-helper";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {

  @Input() item!: { year : number, week? : number, preview? : string[] };
  @Input() isAoty! : boolean;
  routerLink : string[] = [];

  weekHelper = new WeekHelper();

  ngOnInit() {
    if (this.isAoty) {
      this.routerLink = ['/aoty', this.item.year.toString()];
    } else {
      this.routerLink = ['/sotw', this.item.year.toString() + this.createWeekString(this.item.week!)]
    }
  }

  private createWeekString (week : number) : string {
    const weekStr = week.toString();
    if (weekStr.length === 1) {
      return "0" + weekStr;
    } else {
      return weekStr;
    }
  }

}
