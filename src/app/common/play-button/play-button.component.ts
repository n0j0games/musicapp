import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {AudioService} from "../../services/audio.service";
import {SongInfo} from "../../models/songinfo";

@Component({
  selector: 'app-play-button',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './play-button.component.html'
})
export class PlayButtonComponent implements OnDestroy {

  @Input() isPlaying! : boolean;
  @Input() url! : SongInfo | SongInfo[];
  @Input() isOnlyStopButton: boolean = false;
  @Input() color! : string;

  constructor(private audioService: AudioService) {
  }

  playAudio() {
    if (this.isPlaying) {
      this.audioService.stopAudio();
    } else if (this.isOnlyStopButton) {
      return;
    } else if (this.url instanceof SongInfo) {
      this.audioService.playAudio(this.url);
    } else {
      this.audioService.playAudioFromList(this.url);
    }

  }

  ngOnDestroy() {
    this.audioService.stopAudio();
  }

}
