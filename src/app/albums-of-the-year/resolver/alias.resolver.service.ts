import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../../common/services/data-storage.service";
import {AotyService} from "../services/aoty.service";
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
