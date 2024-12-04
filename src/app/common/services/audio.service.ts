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
    public pausedChanged$ = new Subject<boolean>();
    public audioLengthChanged$ = new Subject<number | null>();
    private track : string | null = null;
    private artist: string | null = null;
    private DEFAULT_VOLUME: number = 0.2;
    private volume: number = this.DEFAULT_VOLUME;

    constructor() {
        const context = this;
        this.audio.preload = "metadata";
        this.audio.onloadedmetadata = function() {
            context.audioLengthChanged$.next(context.audio.duration);
            context.pausedChanged$.next(context.audio.paused);
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
        const raw = this.artist + " - " + this.track;
        return raw.length < 63 ? raw : raw.substring(0, 60) + "...";
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
        this.audio.volume = this.volume;
        this.audio.src = previewUrl.url;
        this.track = previewUrl.track;
        this.artist = previewUrl.artist;
        this.audio.load();
        this.audio.play().then(() => console.log("Playing " + this.audio.src));
        this.playStatusChanged$.next(this.audio.src);
        this.pausedChanged$.next(false);
    }

    stopAudio(force = false) {
        this.playlist = [];
        this.track = null;
        this.artist = null;
        if (!this.audio.paused || force) {
            this.audio.pause();
            console.log("Stopped audio")
        }
        this.playStatusChanged$.next(null);
        this.pausedChanged$.next(true);
    }

    pause() {
        if (!this.audio.paused) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.pausedChanged$.next(this.audio.paused);
    }

    mute() {
        if (this.volume === this.DEFAULT_VOLUME) {
            this.volume = 0;
        } else {
            this.volume = this.DEFAULT_VOLUME;
        }
        this.audio.volume = this.volume;
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