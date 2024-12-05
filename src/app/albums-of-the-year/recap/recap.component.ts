import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AotyItem} from "../../common/models/aoty-item";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AotyService} from "../../common/services/aoty.service";
import {Album} from "../../common/models/album";
import {AsyncPipe, LowerCasePipe, NgIf, NgStyle, UpperCasePipe} from "@angular/common";
import {SongInfo} from "../../common/models/songinfo";
import {AudioService} from "../../common/services/audio.service";
import {animate, AnimationBuilder, keyframes, state, style, transition, trigger} from "@angular/animations";
import {TypewriterService} from "../../common/services/typewriter.service";
import {map} from "rxjs";

@Component({
    selector: 'app-recap',
    standalone: true,
    imports: [
        UpperCasePipe,
        LowerCasePipe,
        NgIf,
        NgStyle,
        AsyncPipe,
        RouterLink
    ],
    templateUrl: './recap.component.html',
    styleUrl: './recap.component.scss'
    /*animations: [
        trigger('updateAnimation', [
            state('0', style({ background : `linear-gradient(-45deg, ${this.linearGradients[this.activeAlbumNumber-1][0]}}, ${this.linearGradients[this.activeAlbumNumber-1][1]}, #ffffff, #595959)`})),

            transition('0 => 1', animate('gradient 5s ease forwards'))
        ]),
    ],*/
})
export class RecapComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('outer', { static: false }) outerElement!: ElementRef;

    activeYear: number = 0;
    albumsOfTheYear!: AotyItem | null;
    allowedYears = ['2022','2023','2024'];

    activeAlbum!: Album;
    maxAlbums = 25;
    activeAlbumNumber = this.maxAlbums;
    playTracks!: SongInfo[][];
    urls!: SongInfo[];
    interruptExpected = false;

    // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);

    defaultGradient: string = "#252525";
    linearGradients: string[] = [];
    destroyCalled = false;

    constructor(private route: ActivatedRoute, private router: Router, private aotyService: AotyService, private audioService: AudioService, private builder: AnimationBuilder, private typeWriterService: TypewriterService) {
    }

    typedText$ : any;
    typedArtist$ : any;


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

    ngOnInit(): void {
        const year = this.route.snapshot.paramMap.get('year');
        if (year === undefined || year === null) {
            this.router.navigate(['**']).then(() => console.error("Undefined year, routed to 404"));
            return;
        }
        this.activeYear = <number><unknown>year;
        console.log(this.allowedYears, this.activeYear);
        if (!this.allowedYears.includes(this.activeYear.toString())) {
            this.router.navigate(['/aoty', this.activeYear]).then(() => console.log("Unsupported year, routed to aoty"));
        }

        this.albumsOfTheYear = this.aotyService.getAlbumsOfTheYear(this.activeYear);
        if (this.albumsOfTheYear == null) {
            this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
            return;
        }
        for (let album of this.albumsOfTheYear.albums) {
            album.year = this.activeYear;
        }
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.slice();
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating).slice(0, this.maxAlbums)
        this.playTracks = this.aggregateSongs();
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
        this.activeAlbum = this.albumsOfTheYear!.albums[this.activeAlbumNumber-1];
        this.typedText$ = this.typeWriterService.getTypewriterEffect([this.activeAlbum.title.toLowerCase()], 50).pipe(map((text) => text))
        this.typedArtist$ = this.typeWriterService.getTypewriterEffect([this.activeAlbum.artist.toLowerCase()], 100).pipe(map((text) => text))
        this.playAudio();
        this.makeAnimation(reverse);
    }

    private aggregateSongs() {
        const albums: Album[] =  <Album[]> this.albumsOfTheYear!.albums;
        console.log(albums, "albums")
        const aggregatedSongs: SongInfo[][] = [];
        for (let album of albums) {
            const aggregatedSongsPerAlbum: SongInfo[] = [];
            if (album.songs == undefined) {
                console.log(album, "undef songs")
            } else {
                for (let i=0; i<1; i++) {
                    aggregatedSongsPerAlbum.push({
                        track: album.songs[i].title,
                        url: album.songs[i].preview_url,
                        artist: album.artist
                    })
                    this.linearGradients.push(album.color != null ? album.color : this.defaultGradient)
                }
                aggregatedSongs.push(aggregatedSongsPerAlbum);
            }
        }
        return aggregatedSongs;
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
