import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../../common/services/data-storage.service";
import {SotwService} from "../services/sotw.service";
import {SotwItem} from "../models/sotw-item";

@Injectable({
    providedIn: 'root'
})
export class SotwItemResolverService implements Resolve<SotwItem> {

    constructor(private dataStorageService : DataStorageService,
                private sotwService : SotwService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<SotwItem> {

        const rawWeek = route.paramMap.get("week");
        if (rawWeek === undefined || rawWeek === null) {
            throw new Error("Invalid week/year combination");
        }
        const year = <number><unknown>rawWeek.slice(0, 4);
        const week = <number><unknown>rawWeek.slice(4, 6);
        const sotwItem = this.sotwService.getSongsOfWeek(week, year);
        return sotwItem !== null ? sotwItem : this.dataStorageService.fetchSotwItem(week, year);
    }

}
