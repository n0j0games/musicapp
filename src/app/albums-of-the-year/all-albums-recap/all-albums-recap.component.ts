import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Album} from "../models/album";
import {SongInfo} from "../../common/utils/songinfo";
import {RecapComponent} from "../../common/components/recap/recap.component";
import {BehaviorSubject} from "rxjs";
import {Logger} from "../../common/utils/logger";
import {AotyService} from "../services/aoty.service";

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
    }

    private getAllFavs() {
        this.aotyService.searchAndMapAotyItems({ rating: [9, 10] }).subscribe(p => {
            if (p.albums.length == 0) {
                this.router.navigate(['**']).then(() => this.logger.error("No data, routed to 404"));
                return;
            }
            const albums = p.albums.slice()
                .sort((a, b) => b.rating - a.rating)
                .splice(0, 100);
            this.initializePlayTracksAndAoty(albums);
        });
    }

    private initializePlayTracksAndAoty(albums: Album[]) {
        this.playTracks = this.aggregateSongs(albums);
        this.albumsOfTheYear$.next({ items : albums, playTracks : this.playTracks, linearGradients: this.linearGradients, maxAlbums: this.maxAlbums });
    }

    private aggregateSongs(albums: Album[]) {
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
