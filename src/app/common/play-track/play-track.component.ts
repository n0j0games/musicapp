import {Component, OnInit} from '@angular/core';
import {AudioService} from "../../services/audio.service";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {RemoveFeatPipe} from "../remove-feat.pipe";

@Component({
  selector: 'app-play-track',
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    NgIf,
    RemoveFeatPipe
  ],
  templateUrl: './play-track.component.html',
  styleUrl: './play-track.component.scss'
})
export class PlayTrackComponent implements OnInit {

  isPlaying: boolean = false;
  duration: number = 1;
  active: number = 0;
  url: string | null = null;
  track : string | null = null;

  constructor(private audioService: AudioService) {}


  ngOnInit() {
    this.audioService.audioLengthChanged$.subscribe(duration => {
      this.setAudioLength(duration, this.audioService.getUrl())
      this.track = this.audioService.getTrack();
    })
  }

  private setAudioLength(duration : number | null, url : string) {
    if (duration === null) {
      this.url = null;
      this.duration = 1;
      this.active = 0;
      this.isPlaying = false;
      return;
    }
    this.url = url;
    this.duration = duration;
    this.isPlaying = true;
    this.active = 0;
    this.timeout(this, url);
  }

  private timeout(context : PlayTrackComponent, activeUrl : string) {
    setTimeout(function () {
      if (!context.isPlaying || activeUrl !== context.url) {
        return; // finished
      }
      context.active += 0.5;
      if (context.active < context.duration) {
        context.timeout(context, activeUrl);
      }
    }, 500);
  }

}
