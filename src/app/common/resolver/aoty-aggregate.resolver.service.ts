import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../services/data-storage.service";
import {AotyService} from "../services/aoty.service";
import {AotyItem} from "../models/aoty-item";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AotyAggregateResolverService implements Resolve<(AotyItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private aotyService : AotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(AotyItem|HttpErrorResponse)[]> {

        let aotyList = this.aotyService.getAotyList();
        const queryYears = aotyList?.items === undefined ?
            [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] :
            aotyList!.items!.map(value => value.year);
        const aotyItem = this.aotyService.getAggregatedAlbums(queryYears);
        if (aotyItem !== null) {
            return aotyItem;
        }
        return this.dataStorageService.fetchAggregatedAotyItems(queryYears);
    }

}
