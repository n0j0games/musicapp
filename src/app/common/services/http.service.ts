import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {AotyRequest} from "../../albums-of-the-year/models/aoty-request";
import {AotyResponse} from "../../albums-of-the-year/models/aoty-response";
import {Router} from "@angular/router";
import {Logger} from "../utils/logger";
import {AliasList} from "../../albums-of-the-year/models/alias-list";

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    private rootUrl = 'https://noahschuette-api.netlify.app/.netlify/functions/rest/rncl'

    private logger: Logger = new Logger(this);

    constructor(private http: HttpClient,
                private router: Router) { }

    searchAlbums(req: AotyRequest): Observable<AotyResponse> {
        return this.http.post<AotyResponse>(
            this.rootUrl + '/aoty/search', req
        ).pipe(catchError((err, _) => {
                this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
                return of(err);
            }));
    }

    getAliasList(): Observable<AliasList> {
        return this.http.get<AliasList>(
            this.rootUrl + '/alias-list'
        ).pipe(catchError((err, _) => {
            this.router.navigate(['**']).then(() => this.logger.error("Error while loading", err));
            return of(err);
        }));
    }

}