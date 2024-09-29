import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Song} from "../../models/song";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {RatingComponent} from "../../common/rating/rating.component";
import {AudioService} from "../../services/audio.service";

@Component({
  selector: 'app-song-detail',
  standalone: true,
    imports: [
        NgOptimizedImage,
        RatingComponent,
        NgIf
    ],
  templateUrl: './song-detail.component.html',
  styleUrl: './song-detail.component.scss'
})
export class SongDetailComponent implements OnInit, OnDestroy {

    isPlaying = false;

    constructor(private audioService : AudioService) {
    }

    ngOnInit() {
        this.audioService.playStatusChanged$.subscribe(status => {
            this.isPlaying = status !== null && status === this.song.previewUrl
        })
    }

    ngOnDestroy() {
        this.audioService.stopAudio();
    }

    @Input() song! : Song;

    playAudio() {
        this.audioService.playAudio(this.song.previewUrl)
    }

}
