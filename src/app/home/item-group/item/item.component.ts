import {Component, Input, OnInit} from '@angular/core';
import {LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Params, Router, RouterLink} from "@angular/router";
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
  @Input() queryParams! : Params;
  @Input() text! : string;
  @Input() isDecade : boolean = false;
  routerLink : string[] = [];

  fridayOfTheWeek! : string;
  weekHelper = new WeekHelper();

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.isAoty === "AOTY" || this.isAoty === "LIST") {
      this.routerLink = ['/aoty'];
    } else if (this.isAoty === "SOTW") {
      this.fridayOfTheWeek = this.weekHelper.getFridayOfWeek(this.item.week, this.item.year);
      this.routerLink = ['/sotw', this.item.year.toString() + this.createWeekString(this.item.week!)]
    } else if (this.isAoty === "SOTY") {
      this.routerLink = ['/soty', this.item.year.toString()]
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

  navigate() {
    const qParams = this.queryParams;
    this.router.navigate(
        this.routerLink,
        {
          queryParams: qParams,
          queryParamsHandling: 'merge'
        }
    ).then(_ => {console.log("Refreshed params")});
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
