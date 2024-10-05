import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "./data-storage.service";
import {SotwService} from "./sotw.service";
import {SotwItem} from "../models/sotw-item";
import {AotyService} from "./aoty.service";
import {AotyItem} from "../models/aoty-item";
import {Album} from "../models/album";
import {HttpErrorResponse} from "@angular/common/http";
import {AotyList} from "../models/aoty-list";

@Injectable({
    providedIn: 'root'
})
export class AotyAggregateResolverService implements Resolve<(AotyItem|HttpErrorResponse)[]> {

    constructor(private dataStorageService : DataStorageService,
                private aotyService : AotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<(AotyItem|HttpErrorResponse)[]> {

        const aggregation = route.paramMap.get("query");
        if (aggregation === undefined || aggregation === null) {
            throw new Error("Invalid query");
        }
        let aotyList = this.aotyService.getAotyList();
        const queryYears = aotyList?.items === undefined ?
            [1960, 1970, 2000, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] :
            aotyList!.items!.map(value => value.year);
        const aotyItem = this.aotyService.getAggregatedAlbums(queryYears);
        if (aotyItem !== null) {
            return aotyItem;
        }
        return this.dataStorageService.fetchAggregatedAotyItems(queryYears);
    }

}
