import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Song} from "../../models/song";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RatingComponent} from "../../common/rating/rating.component";
import {AudioService} from "../../services/audio.service";
import {PlayButtonComponent} from "../../common/play-button/play-button.component";
import {SongInfo} from "../../models/songinfo";

@Component({
  selector: 'app-song-detail',
  standalone: true,
    imports: [
        NgOptimizedImage,
        RatingComponent,
        NgIf,
        PlayButtonComponent
    ],
  templateUrl: './song-detail.component.html'
})
export class SongDetailComponent implements OnInit {

    isPlaying = false;

    @Input() song! : Song;
    @Input() index!: number | null;

    songInfo! : SongInfo;

    constructor(private audioService : AudioService) {
    }

    ngOnInit() {
        this.songInfo = this.getSongInfo();
        this.audioService.playStatusChanged$.subscribe(status => {
            this.isPlaying = status !== null && status === this.song.previewUrl
        })
    }

    getSongInfo() {
        return new SongInfo(this.song.title, this.song.previewUrl, this.song.artist);
    }

}
