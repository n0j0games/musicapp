import {Injectable} from "@angular/core";
import {AotyRequest} from "../models/aoty-request";
import {Observable} from "rxjs";
import {AotyResponse} from "../models/aoty-response";
import {HttpService} from "../../common/services/http.service";
import {AliasList} from "../models/alias-list";
import {QueryParams} from "../../common/utils/query-param-helper";

@Injectable({
    providedIn: 'root'
})
export class AotyService {

    constructor(private http: HttpService) {
    }

    public searchAndMapAotyItems(request: AotyRequest) {
        return this.http.searchAlbums(request);
    }

    public searchAotyItems(params: QueryParams): Observable<AotyResponse> {
        const request: AotyRequest = this.mapRequest(params);
        return this.http.searchAlbums(request);
    }

    public getAliasList(): Observable<AliasList> {
        return this.http.getAliasList();
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

}