import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "./data-storage-service";
import {SotwService} from "./sotw-service";

@Injectable({
  providedIn: 'root'
})
export class SotwResolverService implements Resolve<SotwList> {

  constructor(private dataStorageService : DataStorageService,
              private sotwService : SotwService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<SotwList> {

    const sotwList = this.sotwService.getSotwList();
    console.log(sotwList, sotwList.items);
    if (sotwList.items === undefined) {
        return this.dataStorageService.fetchSotwList();
    }
    return sotwList;
  }

}
