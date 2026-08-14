import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {AotyRequest} from "../../albums-of-the-year/models/aoty-request";
import {AotyResponse} from "../../albums-of-the-year/models/aoty-response";
import {Router} from "@angular/router";
import {Logger} from "../utils/logger";
import {AliasList} from "../../albums-of-the-year/models/alias-list";
import {SpotifySearchResponse} from "../../admin/models/spotify-search-response";
import {SpotifyGetAlbumResponse} from "../../admin/models/spotify-get-album-response";
import {CredentialResponse, Credentials, PermissionService} from "./permission.service";
import {AotyAddRequest} from "../../albums-of-the-year/models/aoty-add-request";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private permissionService = inject(PermissionService);

    private remoteUrl = 'https://noahschuette-api.netlify.app/.netlify/functions/rest';
    private localUrl = 'http://localhost:8888/.netlify/functions/rest';
    private rootUrl = this.remoteUrl;

    private logger: Logger = new Logger(this);

    constructor(private http: HttpClient,
                private router: Router) {

    }

    auth(credentials: Credentials): Observable<CredentialResponse> {
        return this.http.post<CredentialResponse>(
            this.rootUrl + '/auth', credentials).pipe(
                catchError((err, _) => {
                    this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                    return of(err);
                }),
            tap(t => this.permissionService.accessToken.set(t.accessToken)),
            );
    }

    searchSpotify(req: string): Observable<SpotifySearchResponse> {
        return this.http.post<SpotifySearchResponse>(
            this.rootUrl + '/rncl/search-spotify', { query: req }).pipe(
                catchError((err, _) => {
                    this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                    return of(err);
        }));
    }

    searchSpotifyGetAlbum(id: string): Observable<SpotifyGetAlbumResponse> {
        return this.http.post<SpotifyGetAlbumResponse>(
            this.rootUrl + '/rncl/spotify-get-album', { id: id }).pipe(
            catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            }));
    }

    searchAlbums(req: AotyRequest): Observable<AotyResponse> {
        return this.http.post<AotyResponse>(
            this.rootUrl + '/rncl/aoty/search', req
        ).pipe(catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            }));
    }

    addAlbums(req: AotyAddRequest): Observable<void> {
        return this.http.put<void>(
            this.rootUrl + '/rncl/aoty', req, {
                headers: new HttpHeaders({ Authorization: `Bearer ${this.permissionService.accessToken()}` })
            }
        ).pipe(catchError((err, _) => {
            this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
            return of(err);
        }));
    }

    getAliasList(): Observable<AliasList> {
        return this.http.get<AliasList>(
            this.rootUrl + '/rncl/alias-list'
        ).pipe(catchError((err, _) => {
            this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
            return of(err);
        }));
    }

}