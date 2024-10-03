import {Component, Input, OnInit} from '@angular/core';
import {AudioService} from "../../services/audio.service";
import {Album} from "../../models/album";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {PlayButtonComponent} from "../../common/play-button/play-button.component";
import {RatingComponent} from "../../common/rating/rating.component";
import {RemoveDeluxePipe} from "../../common/remove-deluxe.pipe";
import {RemoveFeatPipe} from "../../common/remove-feat.pipe";

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    NgIf,
    PlayButtonComponent,
    RatingComponent,
    RemoveDeluxePipe,
    RemoveFeatPipe,
    NgStyle,
    NgClass
  ],
  templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit {

  isPlaying = false;

  previewUrls : string[] = [];

  @Input() album! : Album;
  @Input() index! : number;

  constructor(private audioService : AudioService) {
  }

  ngOnInit() {
    this.previewUrls = this.album.songs!.map(song => song.preview_url);
    this.audioService.playStatusChanged$.subscribe(status => {
      this.isPlaying = status !== null && this.previewUrls.includes(status);
    })
  }

  getAlbumNames() : string {
    const songs = this.album.songs;
    if (songs === undefined) {
      return "";
    }
    return songs.map(a => a.title).join(", ")
  }

}
