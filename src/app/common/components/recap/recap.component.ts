import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AotyItem} from "../../models/aoty-item";
import {RouterLink} from "@angular/router";
import {Album} from "../../models/album";
import {AsyncPipe, LowerCasePipe, NgClass, NgForOf, NgIf, NgStyle, UpperCasePipe} from "@angular/common";
import {SongInfo} from "../../models/songinfo";
import {AudioService} from "../../services/audio.service";
import {animate, AnimationBuilder, keyframes, style} from "@angular/animations";
import {TypewriterService} from "../../services/typewriter.service";
import {map, Observable} from "rxjs";
import {SotwItem} from "../../models/sotw-item";
import {Song} from "../../models/song";

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
    @Input() activeYear: number = 0;
    @Input() title! : string;
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

    constructor(private audioService: AudioService, private builder: AnimationBuilder, private typeWriterService: TypewriterService) {
    }

    ngOnInit(): void {
        this.recapItems$.subscribe({
            next: (value) => {
                console.log("BRR", value);
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
                    console.log(playStatus, !this.interruptExpected)
                    if (playStatus == null && !this.interruptExpected) {
                        console.log("NEXT");
                        this.nextAlbum();
                    }
                })
                this.updateActiveAlbum(false);
            },
            error: (e) => console.error(e)
        })
    }

    private createStyle(reverse: boolean) {

        console.log("AA", this.activeAlbumNumber, this.linearGradients[this.activeAlbumNumber-1], this.linearGradients[this.activeAlbumNumber]);

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
            console.warn("Element undefined");
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
        console.log("NEXT");
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
        console.log("ARI", this.recapItems)
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
        console.log("KILL");
        this.audioService.stopAudio(true);
    }

}
