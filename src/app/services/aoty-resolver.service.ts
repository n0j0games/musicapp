import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "./data-storage.service";
import {SotwService} from "./sotw.service";
import {AotyService} from "./aoty.service";

@Injectable({
  providedIn: 'root'
})
export class AotyResolverService implements Resolve<{ items? : number[] }> {

  constructor(private dataStorageService : DataStorageService,
              private aotyService : AotyService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<{ items? : number[] }> {

    const aotyList = this.aotyService.getAotyList();
    if (aotyList === null || aotyList.items === undefined) {
        return this.dataStorageService.fetchAotyList();
    }
    return aotyList;
  }

}
