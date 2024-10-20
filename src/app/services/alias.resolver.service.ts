import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "./data-storage.service";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
import {AotyList} from "../models/aoty-list";
import {AliasList} from "../models/alias-list";

@Injectable({
    providedIn: 'root'
})
export class AliasResolverService implements Resolve<AliasList> {

    constructor(private dataStorageService : DataStorageService,
                private aotyService : AotyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<AliasList> {

        const aliasList = this.aotyService.getAliasList();
        if (aliasList === undefined) {
            return this.dataStorageService.fetchAliasList();
        }
        return aliasList;
    }

}
