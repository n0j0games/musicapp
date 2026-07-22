import {Component, OnInit} from '@angular/core';
import {Artist} from "../../albums-of-the-year/models/artist";
import {Logger} from "../../common/utils/logger";
import {NormalizeHelper} from "../../common/utils/normalize-helper";
import {GroupAliasHelper} from "../../common/utils/group-alias-helper";
import {AliasList} from "../../albums-of-the-year/models/alias-list";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Sorting} from "../../common/utils/sorting.enum";
import {ProgressBarComponent} from "../../common/components/progress-bar/progress-bar.component";
import {SearchCategory} from "../../common/utils/search-category.enum";
import {AotyService} from "../../albums-of-the-year/services/aoty.service";
import {forkJoin} from "rxjs";
import {Album} from "../../albums-of-the-year/models/album";

@Component({
    selector: 'app-discographies',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ProgressBarComponent
    ],
    templateUrl: './discographies.component.html'
})
export class DiscographiesComponent implements OnInit {

    aliasList: AliasList | null = null;
    loading: boolean = true;

    constructor(private aotyService: AotyService, private router: Router) {
    }

    private logger: Logger = new Logger(this);

    ngOnInit() {
        forkJoin([
            this.aotyService.getAliasList(),
            this.aotyService.searchAndMapAotyItems({}),
        ]).subscribe(([al, a]) => {
            this.aliasList = al;
            this.calculateListenedToAlbums(a.albums);
            this.loading = false;
        });
    }

    private calculateListenedToAlbums(albums: Album[]): void {
        const artists: Artist[] = [];
        for (const artist of this.aliasList!.artists) {
            let count = 0;
            let countFromOther = 0;
            for (const album of albums) {
                const normArtistName = NormalizeHelper.fromNormalToQueryString(artist.name);
                if (GroupAliasHelper.artistFilter(normArtistName, true, false, album, this.aliasList!)) {
                    count += 1;
                    this.logger.debug("Added 1 to " + artist.name, album.title);
                } else if (GroupAliasHelper.artistFilter(normArtistName, false, false, album, this.aliasList!)) {
                    countFromOther += 1;
                    this.logger.debug("Lazy Added 1 to " + artist.name, album.title);
                }
            }
            artists.push({
                ...artist,
                listenedToAlbums: count,
                listenedToGroupAlbums: countFromOther,
                albums: !artist.albums || count > artist.albums ? count : artist.albums
            })
        }
        artists.sort((a, b) => (b.listenedToAlbums ? b.listenedToAlbums : 0) - (a.listenedToAlbums ? a.listenedToAlbums : 0))
        this.aliasList!.artists = artists;
    }

    navigate(artist: string) {
        this.router.navigate(
            ['/aoty'],
            {
                queryParams: {
                    q: NormalizeHelper.fromNormalToQueryString(artist),
                    s: Sorting.RELEASE_DATE,
                    sc: SearchCategory.ARTISTS
                },
                queryParamsHandling: 'merge'
            }
        ).then(_ => {
            this.logger.debug("Refreshed params")
        });
    }

}
