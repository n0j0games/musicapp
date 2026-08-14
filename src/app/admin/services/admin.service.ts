import {inject, Injectable} from "@angular/core";
import {HttpService} from "../../common/services/http.service";
import {map, Observable} from "rxjs";
import {SpotifySearchItem} from "../models/spotify-search-item";
import {SpotifyGetAlbumResponse} from "../models/spotify-get-album-response";
import {Album} from "../../albums-of-the-year/models/album";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private readonly httpService = inject(HttpService);

    public searchSpotify(req: string): Observable<SpotifySearchItem[]> {
        return this.httpService.searchSpotify(req).pipe(
            map(r => r.items)
        )
    }

    public searchSpotifyGetAlbum(id: string): Observable<SpotifyGetAlbumResponse> {
        return this.httpService.searchSpotifyGetAlbum(id);
    }

    public addAlbums(albums: Album[]): void {
        this.httpService.addAlbums({ albums }).subscribe();
    }

}