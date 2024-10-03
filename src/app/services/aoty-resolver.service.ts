import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "./data-storage.service";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";
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
