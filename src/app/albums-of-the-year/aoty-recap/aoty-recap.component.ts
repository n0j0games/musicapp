import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../../common/services/aoty.service";
import {AotyItem} from "../../common/models/aoty-item";
import {Album} from "../../common/models/album";
import {SongInfo} from "../../common/models/songinfo";
import {RecapComponent} from "../../common/components/recap/recap.component";
import {BehaviorSubject} from "rxjs";
import {Logger} from "../../common/logger";

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
    allowedYears = ['0', '0000', '2024', '2023', '2022'];
    maxAlbumsPerAllowedYear = [100, 100, 50, 35, 35]
    maxAlbums = 25;
    defaultGradient: string = "#252525";
    linearGradients: string[] = [];
    title!: string;

    private logger: Logger = new Logger(this);

    ngOnInit(): void {
        const year = this.route.snapshot.paramMap.get('year');
        if (year === undefined || year === null) {
            this.router.navigate(['**']).then(() => this.logger.error("Undefined year, routed to 404"));
            return;
        }
        this.activeYear = <number><unknown>year;
        this.title = 'ALBUMS OF THE YEAR ' + this.activeYear;
        this.maxAlbums = this.maxAlbumsPerAllowedYear[this.allowedYears.indexOf(year)];
        this.logger.debug("Recap: ", this.activeYear, this.title, this.maxAlbums);
        if (!this.allowedYears.includes(this.activeYear.toString())) {
            this.router.navigate(['/aoty', this.activeYear]).then(() => this.logger.warn("Unsupported year, routed to aoty"));
        }

        if (this.activeYear == 0) {
            this.getAllFavs();
        } else {
            this.getAlbumsFromYear();
        }
        this.playTracks = this.aggregateSongs();
        this.albumsOfTheYear$.next({ items : this.albumsOfTheYear!.albums, playTracks : this.playTracks, linearGradients: this.linearGradients, maxAlbums: this.maxAlbums });
    }

    private getAlbumsFromYear() {
        this.albumsOfTheYear = this.aotyService.getAlbumsOfTheYear(this.activeYear);
        if (this.albumsOfTheYear == null) {
            this.router.navigate(['**']).then(() => this.logger.error("Empty year, routed to 404"));
            return;
        }
        for (let album of this.albumsOfTheYear.albums) {
            if (album.year === undefined) {
                album.year = this.activeYear;
            }
        }
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.slice();
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.filter(aoty => !aoty.type);
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating);
    }

    private getAllFavs() {
        let aotyList = this.aotyService.getAotyList();
        const queryYears = aotyList!.items!.map(value => value.year);
        let albums = this.getAggregatedAlbums(queryYears);
        albums = albums.filter(value => value.rating >= 8);
        this.albumsOfTheYear = { year : 0, albums : albums, isDecade : false };
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.sort((a, b) => b.rating - a.rating);
        this.albumsOfTheYear.albums = this.albumsOfTheYear.albums.splice(0, 100);
    }

    private getAggregatedAlbums(queryYears : number[]) : Album[] {
        let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
        if (aotyItems == null) {
            this.router.navigate(['**']).then(() => this.logger.error("Empty query, routed to 404"));
            return [];
        }
        aotyItems = aotyItems.sort((a, b) => a.year - b.year);
        let albums : Album[] = [];
        for (const item of aotyItems) {
            const albums_ = item.albums.slice();
            for (const album of albums_) {
                if (album.year === undefined) {
                    album.year = item.year;
                }
            }
            albums = albums.concat(albums_);
        }
        return albums;
    }


    private aggregateSongs() {
        const albums: Album[] = <Album[]>this.albumsOfTheYear!.albums;
        this.logger.debug(albums, "albums")
        const aggregatedSongs: SongInfo[][] = [];
        for (let album of albums) {
            const aggregatedSongsPerAlbum: SongInfo[] = [];
            if (album.songs == undefined) {
                this.logger.debug(album, "undef songs")
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

    protected readonly Math = Math;
}
