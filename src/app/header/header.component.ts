import {Component} from '@angular/core';
import {WeekHelper} from "../common/week-helper";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router : Router) {
  }

  private weekHelper = new WeekHelper();
  currentYear : number = new Date().getFullYear();
  currentWeek : number = this.weekHelper.getCurrentDateWeek();

}
