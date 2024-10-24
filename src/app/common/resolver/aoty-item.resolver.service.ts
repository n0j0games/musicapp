import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../services/data-storage.service";
import {AotyService} from "../services/aoty.service";
import {AotyItem} from "../models/aoty-item";

@Injectable({
    providedIn: 'root'
})
export class AotyItemResolverService implements Resolve<AotyItem> {

    constructor(private dataStorageService : DataStorageService,
                private aotyService : AotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<AotyItem> {

        const rawYear = route.paramMap.get("year");
        if (rawYear === undefined || rawYear === null) {
            throw new Error("Invalid year");
        }
        const year = <number><unknown>rawYear;
        const aotyItem = this.aotyService.getAlbumsOfTheYear(year);
        return aotyItem !== null ? aotyItem : this.dataStorageService.fetchAotyItem(year);
    }

}
