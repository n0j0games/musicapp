import {Album} from "./models/album";
import {QueryParams} from "./query-param-helper";

/**
 * Helper for filtering entries by query parameters
 */
export module QueryFilterHelper {

export function passYearFilter(queryParams: QueryParams, year: number): boolean {
        if (queryParams.year === null) {
            return true;
        }
        return year == queryParams.year;
    }

    export function passRatingFilter(queryParams: QueryParams, rating: number): boolean {
        if (queryParams.rating === null) {
            return true;
        }
        if (queryParams.rating >= 10) {
            return rating >= 10;
        }
        if (queryParams.rating <= 1) {
            return rating <= 1;
        }
        return rating >= queryParams.rating && rating < (queryParams.rating + 1);
    }

    export function passReviewOnlyFilter(queryParams: QueryParams, review: string | undefined): boolean {
        if (!queryParams.isReviewsOnly) {
            return true;
        }
        return !!review;
    }

    export function passDecadeFilter(queryParams: QueryParams, year: number): boolean {
        if (queryParams.decade === null || queryParams.year !== null) {
            return true;
        }
        return year >= queryParams.decade && year < (queryParams.decade + 10);
    }

}
