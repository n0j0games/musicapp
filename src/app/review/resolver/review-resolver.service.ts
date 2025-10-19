import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {DataStorageService} from "../../common/services/data-storage.service";
import {ReviewService} from "../services/review.service";

@Injectable({
    providedIn: 'root'
})
export class ReviewResolverService implements Resolve<string> {

    constructor(private dataStorageService : DataStorageService,
                private reviewService : ReviewService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<string> {

        const path = route.paramMap.get("path");
        if (path === undefined || path === null) {
            throw new Error("Invalid path");
        }
        if (!this.reviewService.reviewExist(path)) {
            return this.dataStorageService.fetchReview(path);
        }
        return this.reviewService.getReview(path);
    }

}
