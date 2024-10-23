import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../services/data-storage.service";
import {SotwService} from "../services/sotw.service";
import {SotwItem} from "../models/sotw-item";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class SotwAggregateResolverService implements Resolve<(SotwItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private sotwService : SotwService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(SotwItem|HttpErrorResponse)[]> {

        const rawYear = route.paramMap.get("year");
        if (rawYear === undefined || rawYear === null) {
            throw new Error("Invalid year");
        }
        const year : number = parseInt(rawYear);
        const sotyItem = this.sotwService.getSongsOfTheYear(year);
        if (sotyItem !== null) {
            return sotyItem;
        }
        const validWeeks : number[] = this.range(0, 52, 1)
        return this.dataStorageService.fetchAggregatedSotwItems(year, validWeeks);
    }

    private range(start : number, stop : number, step : number) {
        return Array.from(
            { length: (stop - start) / step + 1 },
            (_, i) => start + i * step
        );
    }

}
