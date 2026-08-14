import {Injectable} from "@angular/core";
import {AotyRequest} from "../models/aoty-request";
import {Observable, of, tap} from "rxjs";
import {AotyResponse} from "../models/aoty-response";
import {HttpService} from "../../common/services/http.service";
import {AliasList} from "../models/alias-list";
import {QueryParams} from "../../common/utils/query-param-helper";

@Injectable({
    providedIn: 'root'
})
export class AotyService {

    private cache = new Map<string, AotyResponse>;
    private aliasList: AliasList | null = null;

    constructor(private http: HttpService) {
    }

    public searchAndMapAotyItems(request: AotyRequest): Observable<AotyResponse> {
        const keys = Array.from(this.cache.keys());
        const cacheKey = this.toCacheKey(request);
        if (keys.includes(cacheKey)) {
            console.log('Using cache with key ' + cacheKey);
            return of(this.cache.get(cacheKey)!);
        } else {
            console.log('Requesting new for ' + cacheKey);
            return this.http.searchAlbums(request).pipe(
                tap(x => this.cache.set(cacheKey, x)),
            );
        }
    }

    public searchAotyItems(params: QueryParams): Observable<AotyResponse> {
        const request: AotyRequest = this.mapRequest(params);
        return this.searchAndMapAotyItems(request);
    }

    public getAliasList(): Observable<AliasList> {
        if (this.aliasList) {
            return of(this.aliasList);
        } else {
            return this.http.getAliasList().pipe(
                tap(a => this.aliasList = a)
            );
        }

    }

    private mapRequest(params: QueryParams): AotyRequest {
        const req: AotyRequest = {
            isReviewsOnly: params.isReviewsOnly,
            isStrict: params.isStrict,
        };
        if (params.search) {
            req.search = params.search;
        }
        if (params.year) {
            req.year = params.year;
        }
        if (params.decade) {
            req.decade = params.decade;
        }
        if (params.sorting) {
            req.sorting = params.sorting;
        }
        if (params.searchCategory) {
            req.searchCategory = params.searchCategory;
        }
        if (params.rating) {
            req.rating = [params.rating];
        }
        return req;
    }

    private toCacheKey(r: AotyRequest): string {
        return `year:${r.year ?? '-'}|decade:${r.decade ?? '-'}|search:${r.search ?? '-'}|rating:${r.rating ?? '-'}|artist:${r.artist ?? '-'}|` +
            `title:${r.title ?? '-'}|isStrict:${r.isStrict ?? false}|isReviewsOnly:${r.isReviewsOnly ?? false}|searchCategory:${r.searchCategory ?? '-'}|sorting:${r.sorting ?? '-'}|`;
    }

}