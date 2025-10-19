import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    private reviewsByPath : Map<string, string> = new Map<string, string>();

    addReview(path: string, review: string) {
        if (this.reviewsByPath.has(path)) {
            return;
        }
        this.reviewsByPath.set(path, review);
    }

    getReview(path: string): string {
        return this.reviewsByPath.get(path)!;
    }

    reviewExist(path: string) {
        return this.reviewsByPath.get(path) != undefined;
    }


}