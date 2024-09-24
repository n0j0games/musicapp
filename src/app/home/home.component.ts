import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SotwList} from "../models/sotw-list";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  sotwList! : SotwList | null;

  constructor(private sotwService: SotwService) {}

  ngOnInit() {
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

}
