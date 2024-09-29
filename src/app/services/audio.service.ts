import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {SotwList} from "../models/sotw-list";

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private audio = new Audio();
    private previewUrl = "";
    public playStatusChanged$ = new Subject<String | null>();

    playAudio(previewUrl : string) {
        if (!this.audio.paused) {
            this.audio.pause();
            this.playStatusChanged$.next(null);
        }
        if (this.previewUrl === previewUrl) {
            return;
        }
        this.previewUrl = previewUrl;
        this.audio.volume = 0.3;
        this.audio.src = this.previewUrl;
        this.audio.load();
        this.audio.play().then(() => this.playStatusChanged$.next(this.previewUrl));
    }

    stopAudio() {
        if (!this.audio.paused) {
            this.playAudio(this.previewUrl);
        }
    }

}