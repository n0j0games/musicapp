import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../services/data-storage.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MotyItem} from "../models/moty-item";
import {MotyService} from "../services/moty.service";

@Injectable({
    providedIn: 'root'
})
export class MotyResolverService implements Resolve<(MotyItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private motyService : MotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(MotyItem|HttpErrorResponse)[]> {


        let motyList = this.motyService.getAllMoviesAndShows();
        if (motyList !== null && motyList.length !== 0) {
            return motyList;
        }
        return this.dataStorageService.fetchMotyItems();
    }

}
