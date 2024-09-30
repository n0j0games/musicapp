import {Component, Input, OnInit} from '@angular/core';
import {AudioService} from "../../services/audio.service";
import {Album} from "../../models/album";
import {NgIf} from "@angular/common";
import {PlayButtonComponent} from "../../common/play-button/play-button.component";
import {RatingComponent} from "../../common/rating/rating.component";

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    NgIf,
    PlayButtonComponent,
    RatingComponent
  ],
  templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit {

  isPlaying = false;

  @Input() album! : Album;
  @Input() index! : number;

  constructor(private audioService : AudioService) {
  }

  ngOnInit() {
    this.audioService.playStatusChanged$.subscribe(status => {
      this.isPlaying = status !== null && status === this.album.previewUrl
    })
  }

}
