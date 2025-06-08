import {Component, Input, OnInit} from '@angular/core';
import {LowerCasePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Params, Router, RouterLink} from "@angular/router";
import {WeekHelper} from "../../common/week-helper";
import {Logger} from "../../common/logger";

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

  private logger: Logger = new Logger(this);

  constructor(private router: Router) {
  }

  ngOnInit() {
    if (this.isAoty === "AOTY" || this.isAoty === "LIST") {
      this.routerLink = ['/aoty'];
    } else if (this.isAoty === "SOTW") {
      this.fridayOfTheWeek = WeekHelper.getFridayOfWeek(this.item.week, this.item.year);
      this.routerLink = ['/sotw', this.item.year.toString() + this.createWeekString(this.item.week!)]
    } else if (this.isAoty === "SOTY") {
      this.routerLink = ['/soty', this.item.year.toString()]
    } else if (this.isAoty === "SLIST") {
      this.routerLink = ['/shows'];
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
    ).then(_ => {this.logger.debug("Refreshed params")});
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
