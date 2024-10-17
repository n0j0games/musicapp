import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Song} from "../../models/song";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RatingComponent} from "../../common/rating/rating.component";
import {AudioService} from "../../services/audio.service";
import {PlayButtonComponent} from "../../common/play-button/play-button.component";
import {SongInfo} from "../../models/songinfo";
import {RemoveFeatPipe} from "../../common/remove-feat.pipe";
import {RemoveDeluxePipe} from "../../common/remove-deluxe.pipe";

@Component({
  selector: 'app-song-detail',
  standalone: true,
    imports: [
        NgOptimizedImage,
        RatingComponent,
        NgIf,
        PlayButtonComponent,
        RemoveFeatPipe,
        RemoveDeluxePipe
    ],
  templateUrl: './song-detail.component.html'
})
export class SongDetailComponent implements OnInit {

    isPlaying = false;

    @Input() song! : Song;
    @Input() index!: number | null;

    songInfo! : SongInfo | null;

    constructor(private audioService : AudioService) {
    }

    ngOnInit() {
        this.songInfo = this.getSongInfo();
        this.audioService.playStatusChanged$.subscribe(status => {
            this.isPlaying = status !== null && status === this.song.previewUrl
        })
    }

    getSongInfo() {
        if (!this.song.previewUrl) {
            return null;
        }
        return new SongInfo(this.song.title, this.song.previewUrl, this.song.artist);
    }

}
