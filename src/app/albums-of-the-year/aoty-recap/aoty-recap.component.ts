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

@Component({
    selector: 'app-aoty-recap',
    standalone: true,
    imports: [
        RecapComponent
    ],
    templateUrl: './aoty-recap.component.html'
})
export class AotyRecapComponent implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router, private aotyService: AotyService) {
    }

    activeYear: number = 0;
    albumsOfTheYear!: AotyItem | null;
    playTracks!: SongInfo[][];
    albumsOfTheYear$: BehaviorSubject<{
        items: Album[],
        playTracks: SongInfo[][],
        linearGradients: string[],
        maxAlbums: number
    }|null> = new BehaviorSubject<{
        items: Album[],
        playTracks: SongInfo[][],
        linearGradients: string[],
        maxAlbums: number
    }|null>(null)
    allowedYears = ['2024', '2023', '2022'];
    maxAlbumsPerAllowedYear = [50, 35, 35]
    maxAlbums = 25;
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
        this.title = 'ALBUMS OF THE YEAR ' + this.activeYear;
        this.maxAlbums = this.maxAlbumsPerAllowedYear[this.allowedYears.indexOf(year)];
        if (!this.allowedYears.includes(this.activeYear.toString())) {
            this.router.navigate(['/aoty', this.activeYear]).then(() => console.log("Unsupported year, routed to aoty"));
        }

        this.albumsOfTheYear = this.aotyService.getAlbumsOfTheYear(this.activeYear);
        if (this.albumsOfTheYear == null) {
            this.router.navigate(['**']).then(() => console.error("Empty year, routed to 404"));
            return;
        }
        for (let album of this.albumsOfTheYear.albums) {
            if (album.year === undefined) {
                album.year = this.activeYear;
            }
        }
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.slice();
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating).slice(0, this.maxAlbums)
        this.playTracks = this.aggregateSongs();
        this.albumsOfTheYear$.next({ items : this.albumsOfTheYear.albums, playTracks : this.playTracks, linearGradients: this.linearGradients, maxAlbums: this.maxAlbums });
    }

    private aggregateSongs() {
        const albums: Album[] = <Album[]>this.albumsOfTheYear!.albums;
        console.log(albums, "albums")
        const aggregatedSongs: SongInfo[][] = [];
        for (let album of albums) {
            const aggregatedSongsPerAlbum: SongInfo[] = [];
            if (album.songs == undefined) {
                console.log(album, "undef songs")
            } else {
                for (let i = 0; i < 1; i++) {
                    aggregatedSongsPerAlbum.push({
                        track: album.songs[i].title,
                        url: album.songs[i].preview_url,
                        artist: album.artist
                    })
                }
            }
            this.linearGradients.push(album.color != null ? album.color : this.defaultGradient)
            aggregatedSongs.push(aggregatedSongsPerAlbum);
        }
        return aggregatedSongs;
    }

}
