import {Component, OnInit} from '@angular/core';
import {WeekHelper} from "../common/week-helper";
import {Router, RouterLink} from "@angular/router";
import {SotwService} from "../services/sotw.service";
import {SotwList} from "../models/sotw-list";
import {PlayButtonComponent} from "../common/play-button/play-button.component";
import {AudioService} from "../services/audio.service";
import {PlayTrackComponent} from "../common/play-track/play-track.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    PlayButtonComponent,
    PlayTrackComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(private router : Router,
              private sotwService : SotwService,
              private audioService : AudioService) {
  }

  private weekHelper = new WeekHelper();
  currentYear : number = new Date().getFullYear();
  currentWeek : number = this.weekHelper.getCurrentDateWeek();
  isAnySongPlaying : boolean = false;

  ngOnInit() {
    this.audioServiceListener();
    this.sotwListChangedListener();
  }

  private audioServiceListener() {
    this.audioService.playStatusChanged$.subscribe(status => {
      this.isAnySongPlaying = status !== null;
      console.log("YX", this.isAnySongPlaying)
    })
  }

  private sotwListChangedListener() {
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
