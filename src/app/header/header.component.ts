import {Component, OnInit} from '@angular/core';
import {WeekHelper} from "../common/week-helper";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {SotwService} from "../common/services/sotw.service";
import {SotwList} from "../common/models/sotw-list";
import {PlayButtonComponent} from "../common/components/play-button/play-button.component";
import {AudioService} from "../common/services/audio.service";
import {PlayTrackComponent} from "../common/components/play-track/play-track.component";
import {SongInfo} from "../common/models/songinfo";
import {NgClass, NgIf} from "@angular/common";
import {MuteButtonComponent} from "../common/components/mute-button/mute-button.component";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        RouterLink,
        PlayButtonComponent,
        PlayTrackComponent,
        NgClass,
        NgIf,
        MuteButtonComponent
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
  onMovieSite : boolean = false;
  emptyUrl = new SongInfo("","","");

  ngOnInit() {
    this.audioServiceListener();
    this.sotwListChangedListener();
    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.onMovieSite = value.url.startsWith("/moty") || value.url.startsWith("/movie-home")
      }
    })
  }

  private audioServiceListener() {
    this.audioService.playStatusChanged$.subscribe(status => {
      this.isAnySongPlaying = status !== null;
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
