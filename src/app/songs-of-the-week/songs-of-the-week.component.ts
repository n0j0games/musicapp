import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-songs-of-the-week',
  standalone: true,
  imports: [],
  templateUrl: './songs-of-the-week.component.html',
  styleUrl: './songs-of-the-week.component.scss'
})
export class SongsOfTheWeekComponent {

  activeWeek? : string;
  activeYear? : string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const week = this.route.snapshot.paramMap.get('week');
    if (week === undefined) {
      this.router.navigate(['**']).then(() => console.error("Undefined week, routed to 404"));
    }
    this.activeYear = week?.slice(0, 4);
    this.activeWeek = week?.slice(4, 6);
    // load data from service per id
  }

}
