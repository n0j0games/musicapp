import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AudioService} from "../../services/audio.service";
import {SongInfo} from "../../models/songinfo";

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './play-button.component.html'
})
export class PlayButtonComponent implements OnInit, OnDestroy {

  @Input() isPlaying! : boolean;
  @Input() url! : SongInfo | SongInfo[];
  @Input() isOnlyStopButton: boolean = false;
  isPaused = false;

  constructor(private audioService: AudioService) {

  }

  ngOnInit() {
    this.audioService.pausedChanged$.subscribe(pauseStatus => {
      this.isPaused = pauseStatus;
    })
  }

  playAudio() {
    if (this.isOnlyStopButton) {
      if (this.isPlaying) {
        this.audioService.pause();
      }
    } else {
      if (this.isPlaying) {
        this.audioService.pause();
      } else if (this.url instanceof SongInfo) {
        this.audioService.playAudio(this.url);
      } else {
        this.audioService.playAudioFromList(this.url);
      }
    }

  }

  ngOnDestroy() {
    this.audioService.stopAudio();
  }

}
