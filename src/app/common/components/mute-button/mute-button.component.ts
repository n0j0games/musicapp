import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AudioService} from "../../services/audio.service";
import {SongInfo} from "../../utils/songinfo";

@Component({
  selector: 'app-mute-button',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './mute-button.component.html'
})
export class MuteButtonComponent implements OnInit {

  isMuted = false;

  constructor(private audioService: AudioService) {

  }

  ngOnInit() {
    this.audioService.volumeChanged$.subscribe(volume => {
      this.isMuted = volume == 0;
    })
  }

  mute() {
    this.audioService.mute();
  }

}
