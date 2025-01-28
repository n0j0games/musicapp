import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../../common/services/aoty.service";
import {AudioService} from "../../common/services/audio.service";
import {AnimationBuilder} from "@angular/animations";
import {TypewriterService} from "../../common/services/typewriter.service";
import {AotyItem} from "../../common/models/aoty-item";
import {SotwItem} from "../../common/models/sotw-item";
import {Album} from "../../common/models/album";
import {SongInfo} from "../../common/models/songinfo";
import {RecapComponent} from "../../common/components/recap/recap.component";
import {BehaviorSubject} from "rxjs";
import {SotwService} from "../../common/services/sotw.service";
import {Song} from "../../common/models/song";

@Component({
    selector: 'app-sotw-recap',
    standalone: true,
    imports: [
        RecapComponent
    ],
    templateUrl: './sotw-recap.component.html'
})
export class SotwRecapComponent implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router, private sotwService: SotwService) {
    }

    activeYear: number = 0;
    songsOfTheYear!: SotwItem | null;
    playTracks!: SongInfo[][];
    songsOfTheYear$: BehaviorSubject<{
        items: Song[],
        playTracks: SongInfo[][],
        linearGradients: string[],
        maxAlbums: number
    }|null> = new BehaviorSubject<{
        items: Song[],
        playTracks: SongInfo[][],
        linearGradients: string[],
        maxAlbums: number
    }|null>(null)
    allowedYears = ['2024','ALL TIME'];
    maxAlbums = 50;
    activeSongNumber = this.maxAlbums;
    defaultGradient: string = "#252525";
    linearGradients: string[] = [];
    title!: string;

    ngOnInit(): void {
        const year = this.route.snapshot.paramMap.get('year');
        if (year === undefined || year === null) {
            this.router.navigate(['**']).then(() => console.error("Undefined year, routed to 404"));
            return;
        }
        this.activeYear = <number><unknown>year;
        this.title = this.activeYear !== 0 ? 'FAV SONGS OF THE YEAR ' + this.activeYear : 'FAV SONGS OF ALL TIME';
        this.activeSongNumber = this.maxAlbums;
        console.log(this.allowedYears, this.activeYear, this.maxAlbums);
        if (!this.allowedYears.includes(this.activeYear.toString())) {
            this.router.navigate(['/aoty', this.activeYear]).then(() => console.log("Unsupported year, routed to aoty"));
        }

        console.log("YEAR", this.activeYear);
        const sotyItems = this.sotwService.getSongsOfTheYear(parseInt(year));
        /* if (sotyItems === null) {
            this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
            return;
        }*/
        console.log("YEAR_RES", sotyItems);

        let songs  : Song[] = [];
        for (const item of sotyItems!) {
            songs = songs.concat(item.songs);
        }
        this.songsOfTheYear = { year : this.activeYear, week : 0, songs: songs }
        /* for (let song of this.songsOfTheYear.songs) {
            if (song.year === undefined) {
                song.year = this.activeYear;
            }
        }*/
        this.songsOfTheYear.songs = this.songsOfTheYear.songs.slice();
        this.songsOfTheYear.songs = this.songsOfTheYear.songs.sort((a, b) => b.rating - a.rating).slice(0, this.maxAlbums)
        this.playTracks = this.aggregateSongs();
        this.songsOfTheYear$.next({ items : this.songsOfTheYear.songs, playTracks : this.playTracks, linearGradients: this.linearGradients, maxAlbums: this.maxAlbums});
    }

    private aggregateSongs() {
        const songs: Song[] = <Song[]>this.songsOfTheYear!.songs;
        const aggregatedSongs: SongInfo[][] = [];
        for (let song of songs) {
            const aggregatedSongsPerAlbum: SongInfo[] = [];
            aggregatedSongsPerAlbum.push({
                track: song.title,
                url: song.previewUrl,
                artist: song.artist
            })
            this.linearGradients.push(song.color != null ? song.color : this.defaultGradient)
            aggregatedSongs.push(aggregatedSongsPerAlbum);
        }
        return aggregatedSongs;
    }

}
