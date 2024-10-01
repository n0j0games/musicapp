import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {AudioService} from "../../services/audio.service";

@Component({
  selector: 'app-play-button',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './play-button.component.html'
})
export class PlayButtonComponent implements OnDestroy {

  @Input() isPlaying! : boolean;
  @Input() url! : string | string[];

  constructor(private audioService: AudioService) {
  }

  playAudio() {
    if (this.isPlaying) {
      this.audioService.stopAudio();
    } else if (typeof this.url === "string") {
      this.audioService.playAudio(this.url);
    } else {
      this.audioService.playAudioFromList(this.url);
    }

  }

  ngOnDestroy() {
    this.audioService.stopAudio();
  }

}
