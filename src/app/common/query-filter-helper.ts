import {Album} from "./models/album";
import {QueryParams} from "./query-param-helper";

/**
 * Helper for filtering entries by query parameters
 */
export class QueryFilterHelper {

    public static passYearFilter(queryParams: QueryParams, year: number): boolean {
        if (queryParams.year === null) {
            return true;
        }
        return year == queryParams.year;
    }

    public static passRatingFilter(queryParams: QueryParams, rating: number): boolean {
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

    public static passReviewOnlyFilter(queryParams: QueryParams, review: string | undefined): boolean {
        if (!queryParams.isReviewsOnly) {
            return true;
        }
        return !!review;
    }

    public static passDecadeFilter(queryParams: QueryParams, year: number): boolean {
        if (queryParams.decade === null || queryParams.year !== null) {
            return true;
        }
        return year >= queryParams.decade && year < (queryParams.decade + 10);
    }

    public static passCategoryFilter(queryParams: QueryParams, seasonHref: string | undefined): boolean {
        const qCategory = queryParams.category;
        if (qCategory === null || qCategory === 'all') {
            return true;
        }
        return (qCategory === 'shows') === (seasonHref !== undefined)
    }

}
