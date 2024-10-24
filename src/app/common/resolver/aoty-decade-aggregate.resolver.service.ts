import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../services/data-storage.service";
import {AotyService} from "../services/aoty.service";
import {AotyItem} from "../models/aoty-item";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AotyDecadeAggregateResolverService implements Resolve<(AotyItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private aotyService : AotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(AotyItem|HttpErrorResponse)[]> {

        const rawDecade = route.paramMap.get("decade");
        if (rawDecade === undefined || rawDecade === null) {
            throw new Error("Invalid decade");
        }
        const decade : number = parseInt(rawDecade);
        const aotyItem = this.aotyService.getAlbumsOfTheDecade(decade);
        if (aotyItem !== null) {
            return aotyItem;
        }
        const validYears : number[] = this.range(decade, decade + 9, 1)
        return this.dataStorageService.fetchAggregatedAotyItems(validYears);
    }

    private range(start : number, stop : number, step : number) {
        return Array.from(
            { length: (stop - start) / step + 1 },
            (_, i) => start + i * step
        );
    }

}
