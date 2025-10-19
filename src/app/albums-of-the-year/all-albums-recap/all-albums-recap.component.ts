import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AotyService} from "../services/aoty.service";
import {AudioService} from "../../common/services/audio.service";
import {AnimationBuilder} from "@angular/animations";
import {TypewriterService} from "../../common/services/typewriter.service";
import {AotyItem} from "../models/aoty-item";
import {SotwItem} from "../../songs-of-the-week/models/sotw-item";
import {Album} from "../models/album";
import {SongInfo} from "../../common/utils/songinfo";
import {RecapComponent} from "../../common/components/recap/recap.component";
import {BehaviorSubject} from "rxjs";
import {Logger} from "../../common/utils/logger";

@Component({
    selector: 'app-all-albums-recap',
    standalone: true,
    imports: [
        RecapComponent
    ],
    templateUrl: './all-albums-recap.component.html'
})
export class AllAlbumsRecapComponent implements OnInit {

    private logger: Logger = new Logger(this);

    constructor(private route: ActivatedRoute, private router: Router, private aotyService: AotyService) {
    }

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
    maxAlbums = 100;
    defaultGradient: string = "#252525";
    linearGradients: string[] = [];
    title: string = 'FAV ALBUMS OF ALL TIME';

    ngOnInit(): void {
        this.getAllFavs();
        this.playTracks = this.aggregateSongs();
        this.albumsOfTheYear$.next({ items : this.albumsOfTheYear!.albums, playTracks : this.playTracks, linearGradients: this.linearGradients, maxAlbums: this.maxAlbums });
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
                this.logger.debug(album, "Undefined songs")
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
