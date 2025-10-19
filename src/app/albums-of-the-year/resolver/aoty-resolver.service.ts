import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../../common/services/data-storage.service";
import {AotyService} from "../services/aoty.service";
import {AotyList} from "../models/aoty-list";

@Injectable({
  providedIn: 'root'
})
export class AotyResolverService implements Resolve<AotyList> {

  constructor(private dataStorageService : DataStorageService,
              private aotyService : AotyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<AotyList> {

    const aotyList = this.aotyService.getAotyList();
    if (aotyList === null || aotyList.items === undefined) {
        return this.dataStorageService.fetchAotyList();
    }
    return aotyList;
  }

}
