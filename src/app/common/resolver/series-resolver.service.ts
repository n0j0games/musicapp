import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {MotyItem} from "../models/moty-item";
import {HttpErrorResponse} from "@angular/common/http";
import {DataStorageService} from "../services/data-storage.service";
import {MotyService} from "../services/moty.service";

@Injectable({
    providedIn: 'root'
})
export class SeriesResolverService implements Resolve<(MotyItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private motyService : MotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(MotyItem|HttpErrorResponse)[]> {


        let motyList = this.motyService.getAllSeries();
        if (motyList !== null && motyList.length !== 0) {
            return motyList;
        }
        return this.dataStorageService.fetchSeriesItems();
    }

}
