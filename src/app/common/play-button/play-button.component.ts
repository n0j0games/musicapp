import {Component, Input, OnDestroy} from '@angular/core';
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
  @Input() url! : string;

  constructor(private audioService: AudioService) {
  }

  playAudio() {
    this.audioService.playAudio(this.url);
  }

  ngOnDestroy() {
    this.audioService.stopAudio();
  }

}
