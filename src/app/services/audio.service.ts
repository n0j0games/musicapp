import {Injectable, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {SotwList} from "../models/sotw-list";

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private audio = new Audio();
    private playlist : string[] = [];
    public playStatusChanged$ = new Subject<string | null>();

    constructor() {
        const context = this;
        this.audio.addEventListener("ended", function () {
            context.onSongEnded(context);
        });
    }

    playAudioFromList(previewUrls : string[]) {
        this.playlist = previewUrls.slice();
        const firstSong = this.playlist.shift();
        if (firstSong !== undefined) {
            this.playAudio(firstSong);
        }
    }

    playAudio(previewUrl : string) {
        if (!this.audio.paused) {
            this.audio.pause();
        }
        this.audio.volume = 0.3;
        this.audio.src = previewUrl;
        this.audio.load();
        this.audio.play().then(() => console.log("Playing " + this.audio.src));
        this.playStatusChanged$.next(this.audio.src);
    }

    stopAudio() {
        if (!this.audio.paused) {
            this.playlist = [];
            this.playStatusChanged$.next(null);
            this.audio.pause();
        }
    }

    private onSongEnded(context : AudioService) {
        const nextSong = context.playlist.shift();
        if (nextSong !== undefined) {
            context.playAudio(nextSong);
        } else {
            context.stopAudio();
        }
    }

}