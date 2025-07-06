import {Component, OnInit} from '@angular/core';
import {AotyService} from "../../common/services/aoty.service";
import {Artist} from "../../common/models/artist";
import {Logger} from "../../common/logger";
import {NormalizeHelper} from "../../common/normalize-helper";
import {GroupAliasHelper} from "../../common/group-alias-helper";
import {AliasList} from "../../common/models/alias-list";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {Sorting} from "../../common/models/sorting.enum";
import {ProgressBarComponent} from "../../common/components/progress-bar/progress-bar.component";

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

    constructor(private aotyService: AotyService, private router: Router) {
    }

    private logger: Logger = new Logger(this);

    ngOnInit() {
        const aliasList = this.aotyService.getAliasList();
        if (aliasList == undefined) {
            this.logger.error("Alias list is empty");
            return;
        }
        this.aliasList = aliasList;
        this.calculateListenedToAlbums();
        this.logger.debug(this.aliasList);
    }

    private calculateListenedToAlbums() : void {
        let aotyList = this.aotyService.getAotyList();
        const queryYears = aotyList!.items!.map(value => value.year);
        let aotyItems = this.aotyService.getAggregatedAlbums(queryYears);
        if (aotyItems == null) {
            this.logger.error("Aoty list is empty");
            return;
        }
        const artists: Artist[] = [];
        for (const artist of this.aliasList!.artists) {
            let count = 0;
            let countFromOther = 0;
            for (const item of aotyItems) {
                const albums_ = item.albums.slice();
                for (const album of albums_) {
                    const normArtistName = NormalizeHelper.fromNormalToQueryString(artist.name);
                    if (GroupAliasHelper.artistFilter(normArtistName, true, album, this.aliasList!)) {
                        count += 1;
                        this.logger.debug("Added 1 to " + artist.name, album.title);
                    } else if (GroupAliasHelper.artistFilter(normArtistName, false, album, this.aliasList!)) {
                        countFromOther += 1;
                      this.logger.debug("Lazy Added 1 to " + artist.name, album.title);
                    }
                }
            }
            artists.push({
                listenedToAlbums: count,
                listenedToGroupAlbums: countFromOther,
                ...artist
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
          s: Sorting.RELEASE_DATE
        },
        queryParamsHandling: 'merge'
      }
    ).then(_ => {this.logger.debug("Refreshed params")});
  }

}
