import {Component, Input, OnInit} from '@angular/core';
import {AudioService} from "../../common/services/audio.service";
import {Album} from "../../common/models/album";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {PlayButtonComponent} from "../../common/components/play-button/play-button.component";
import {RatingComponent} from "../../common/components/rating/rating.component";
import {RemoveDeluxePipe} from "../../common/pipes/remove-deluxe.pipe";
import {RemoveFeatPipe} from "../../common/pipes/remove-feat.pipe";
import {SongInfo} from "../../common/models/songinfo";
import {VinylComponent} from "../../common/components/vinyl/vinyl.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ContentBadgeComponent} from "../../common/components/content-badge/content-badge.component";
import {LastfmBadge} from "../../common/components/lastfm-badge/lastfm-badge";

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
        NgClass,
        VinylComponent,
        RouterLink,
        ContentBadgeComponent,
        LastfmBadge
    ],
  templateUrl: './album-detail.component.html'
})
export class AlbumDetailComponent implements OnInit {

  isPlaying = false;
  previewUrls : string[] = [];

  @Input() album! : Album;
  @Input() index! : number;
  @Input() showRecentPlays! : boolean;

  songinfo! : SongInfo[];
  albumNames! : string;
  midOrWorst : boolean = false;

  constructor(private audioService : AudioService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.albumNames = this.getAlbumNames();
    this.songinfo = this.getSongInfo();
    this.previewUrls = this.album.songs?
        this.album.songs.map(song => song.preview_url) :
        []
    this.midOrWorst = this.album.rating <= 4;
    this.audioService.playStatusChanged$.subscribe(status => {
      this.isPlaying = status !== null && this.previewUrls.includes(status);
    })
  }

  getAlbumNames() : string {
    const songs = this.album.songs;
    if (songs === undefined) {
      return "";
    }
    return songs.map(a => a.title).join("; ")
  }

  getSongInfo() {
    if (!this.album.songs) {
      return [new SongInfo('','','')];
    }
    return this.album.songs!.map(song => new SongInfo(song.title, song.preview_url, this.album.artist));
  }

  routeToArtist() {
      this.router.navigate(
          [],
          {
              relativeTo: this.route,
              queryParams: { q: this.album.artist.replaceAll(" ", "-").toLowerCase() },
              queryParamsHandling: 'merge'
          }
      ).then(_ => {console.log("Refreshed params")});
  }
}
