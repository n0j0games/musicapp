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

  getAlbumNames() {
    const songs = this.album.songs;
    if (songs === undefined) {
      return undefined;
    }
    return songs.map(a => a.title).join(", ")
  }

}
