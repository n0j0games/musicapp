import {Injectable} from "@angular/core";
import {SotwList} from "../models/sotw-list";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../../common/services/data-storage.service";
import {SotwService} from "../services/sotw.service";

@Injectable({
  providedIn: 'root'
})
export class SotwResolverService implements Resolve<SotwList> {

  constructor(private dataStorageService : DataStorageService,
              private sotwService : SotwService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<SotwList> {

    const sotwList = this.sotwService.getSotwList();
    if (sotwList === null || sotwList.items === undefined) {
        return this.dataStorageService.fetchSotwList();
    }
    return sotwList;
  }

}
