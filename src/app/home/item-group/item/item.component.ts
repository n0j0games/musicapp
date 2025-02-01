import {Component, Input, OnInit} from '@angular/core';
import {LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {WeekHelper} from "../../../common/week-helper";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    LowerCasePipe,
    NgClass
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {

  @Input() item!: { year : number, week? : number, preview? : string[] };
  @Input() isAoty! : string;
  @Input() queryParam! : string;
  @Input() text! : string;
  @Input() isDecade : boolean = false;
  routerLink : string[] = [];

  fridayOfTheWeek! : string;
  weekHelper = new WeekHelper();

  ngOnInit() {
    if (this.isDecade) {
      this.routerLink = ['/aoty-decade', this.item.year.toString()];
    } else if (this.isAoty === "AOTY") {
      this.routerLink = ['/aoty', this.item.year.toString()];
    } else if (this.isAoty === "SOTW") {
      this.fridayOfTheWeek = this.weekHelper.getFridayOfWeek(this.item.week, this.item.year);
      this.routerLink = ['/sotw', this.item.year.toString() + this.createWeekString(this.item.week!)]
    } else if (this.isAoty === "LIST") {
      this.routerLink = ['/aoty-lists', this.queryParam];
    } else if (this.isAoty === "MOTY") {
      this.routerLink = ['/moty', this.item.year.toString()];
    } else if (this.isAoty === "SERIES") {
      this.routerLink = ['/series', this.item.year.toString()];
    } else if (this.isAoty === "MLIST") {
      this.routerLink = ['/moty-lists', this.queryParam];
    } else if (this.isAoty === "SLIST") {
      this.routerLink = ['/series-lists', this.queryParam];
    } else {
      throw new Error("unknown type");
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
