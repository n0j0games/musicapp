import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Params, Router, RouterLink} from "@angular/router";
import {Album} from "../../../albums-of-the-year/models/album";
import {AsyncPipe, LowerCasePipe, NgClass, NgForOf, NgIf, NgStyle, UpperCasePipe} from "@angular/common";
import {SongInfo} from "../../utils/songinfo";
import {AudioService} from "../../services/audio.service";
import {animate, AnimationBuilder, keyframes, style} from "@angular/animations";
import {TypewriterService} from "../../services/typewriter.service";
import {map, Observable} from "rxjs";
import {Song} from "../../../songs-of-the-week/models/song";
import {Logger} from "../../utils/logger";

@Component({
    selector: 'app-recap',
    standalone: true,
    imports: [
        UpperCasePipe,
        LowerCasePipe,
        NgIf,
        NgStyle,
        AsyncPipe,
        RouterLink,
        NgForOf,
        NgClass
    ],
    templateUrl: './recap.component.html',
    styleUrl: './recap.component.scss'
})
export class RecapComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('outer', { static: false }) outerElement!: ElementRef;
    @Input() recapItems$!: Observable<{
        items: Album[] | Song[],
        playTracks: SongInfo[][],
        linearGradients: string[],
        maxAlbums: number
    }|null>;
    @Input() title! : string;
    @Input() link! : string[];
    @Input() routeParams!: Params;
    maxAlbums! : number;
    recapItems!: Album[] | Song[];

    activeRecapItem: Album | Song | null = null;
    activeAlbumNumber = 0;
    playTracks!: SongInfo[][];
    urls!: SongInfo[];
    interruptExpected = false;

    // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);

    defaultGradient: string = "#252525";
    linearGradients: string[] = [];
    destroyCalled = false;

    typedText$ : any;
    typedArtist$ : any;

    private logger: Logger = new Logger("RecapComponent");

    constructor(private audioService: AudioService, private builder: AnimationBuilder, private typeWriterService: TypewriterService, private router: Router) {
    }

    ngOnInit(): void {
        this.recapItems$.subscribe({
            next: (value) => {
                if (value === null) {
                    return;
                }
                this.recapItems = value.items;
                this.playTracks = value.playTracks;
                this.linearGradients = value.linearGradients;
                this.maxAlbums = value.maxAlbums;
                this.activeAlbumNumber = value.maxAlbums;
                this.audioService.playStatusChanged$.subscribe(playStatus => {
                    if (this.destroyCalled) {
                        return;
                    }
                    this.logger.debug(playStatus, !this.interruptExpected)
                    if (playStatus == null && !this.interruptExpected) {
                        this.nextAlbum();
                    }
                })
                this.updateActiveAlbum(false);
            },
            error: (e) => this.logger.error(e)
        })
    }

    routeToAll() {
        const routeParams = this.routeParams;
        this.router.navigate(
            this.link,
            {
                queryParams: routeParams,
                queryParamsHandling: 'merge'
            }
        ).then(_ => {this.logger.debug("Refreshed params")});
    }

    private createStyle(reverse: boolean) {

        if (!reverse) {
            return style({
                backgroundSize : '800% 100%',
                background: `linear-gradient(90deg,
                ${this.activeAlbumNumber >= this.maxAlbums ? this.defaultGradient :this.linearGradients[this.activeAlbumNumber]},
                ${this.activeAlbumNumber >= this.maxAlbums ? this.defaultGradient :this.linearGradients[this.activeAlbumNumber]},
                ${this.linearGradients[this.activeAlbumNumber-1]},
                ${this.linearGradients[this.activeAlbumNumber-1]})`
            });
        }

        return style({
            backgroundSize : '800% 100%',
            background: `linear-gradient(90deg,
                ${this.linearGradients[this.activeAlbumNumber-2]},
                ${this.linearGradients[this.activeAlbumNumber-2]},
                ${this.linearGradients[this.activeAlbumNumber-1]},
                ${this.linearGradients[this.activeAlbumNumber-1]})`
        });
    }

    private makeAnimation(reverse: boolean) {
        // first define a reusable animation

        const myAnimation = this.builder.build( [
            this.createStyle(reverse),
            animate("5s ease", keyframes([
                style({ backgroundPosition: "0% 50%", offset: 0 }),
                style({ backgroundPosition: "25% 50%", offset: 0.1 }),
                style({ backgroundPosition: "75% 50%", offset: 0.9 }),
                style({ backgroundPosition: "100% 50%", offset: 1 })
            ]))
        ]);


        if (this.outerElement === undefined || this.outerElement.nativeElement === undefined) {
            this.logger.warn("Element undefined");
            return;
        }

        // use the returned factory object to create a player
        const player = myAnimation.create(this.outerElement.nativeElement);

        player.play();
    }

    ngAfterViewInit() {
        this.makeAnimation(false);
    }

    prevAlbum() {
        if (this.activeAlbumNumber >= this.maxAlbums) {
            return;
        }
        this.activeAlbumNumber = this.activeAlbumNumber + 1;
        this.updateActiveAlbum(true);
    }

    nextAlbum() {
        if (this.activeAlbumNumber <= 1) {
            return;
        }
        this.activeAlbumNumber = this.activeAlbumNumber - 1;
        this.updateActiveAlbum(false);
    }

    pause() {
        this.interruptExpected = true;
        this.audioService.pause();
        this.interruptExpected = false;
    }

    mute() {
        this.audioService.mute();
    }

    updateActiveAlbum(reverse: boolean) {
        this.activeRecapItem = this.recapItems![this.activeAlbumNumber-1];

        this.typedText$ = this.typeWriterService.getTypewriterEffect([this.activeRecapItem!.title.toLowerCase()], 100, 700).pipe(map((text) => text))
        this.typedArtist$ = this.typeWriterService.getTypewriterEffect([this.activeRecapItem!.artist.toLowerCase()], 100).pipe(map((text) => text))
        this.playAudio();
        this.makeAnimation(reverse);
    }

    playAudio() {
        this.interruptExpected = true;
        this.audioService.stopAudio();
        this.urls = this.playTracks[this.activeAlbumNumber-1];
        this.audioService.playAudioFromList(this.urls);
        this.interruptExpected = false;
    }

    ngOnDestroy() {
        this.destroyCalled = true;
        this.logger.debug("Killing Recap Component");
        this.audioService.stopAudio(true);
    }

}
