import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {SongInfo} from "../models/songinfo";

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private audio = new Audio();
    private playlist : SongInfo[] = [];
    public playStatusChanged$ = new Subject<string | null>();
    public audioLengthChanged$ = new Subject<number | null>();
    private track : string | null = null;
    private artist: string | null = null;

    constructor() {
        const context = this;
        this.audio.preload = "metadata";
        this.audio.onloadedmetadata = function() {
            context.audioLengthChanged$.next(context.audio.duration);
        };
        this.audio.addEventListener("ended", function () {
            context.onSongEnded(context);
        });
        this.playStatusChanged$.subscribe(status => {
            if (status === null) {
                this.audioLengthChanged$.next(null);
            }
        })
    }

    getUrl() {
        return this.audio.src;
    }

    getTrack() {
        if (this.track === null) {
            return null;
        }
        const raw = this.artist?.split(",")[0] + " - " + this.track;
        return raw.length < 37 ? raw : raw.substring(0, 34) + "...";
    }

    playAudioFromList(previewUrls : SongInfo[]) {
        this.playlist = previewUrls.slice();
        const firstSong = this.playlist.shift();
        if (firstSong !== undefined) {
            this.playAudio(firstSong);
        }
    }

    playAudio(previewUrl : SongInfo) {
        if (!this.audio.paused) {
            this.audio.pause();
        }
        this.audio.volume = 0.3;
        this.audio.src = previewUrl.url;
        this.track = previewUrl.track;
        this.artist = previewUrl.artist;
        this.audio.load();
        this.audio.play().then(() => console.log("Playing " + this.audio.src));
        this.playStatusChanged$.next(this.audio.src);
    }

    stopAudio() {
        this.playlist = [];
        this.track = null;
        this.artist = null;
        if (!this.audio.paused) {
            this.audio.pause();
            console.log("Stopped audio")
        }
        this.playStatusChanged$.next(null);
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