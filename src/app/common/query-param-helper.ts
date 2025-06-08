import {FormGroup} from "@angular/forms";
import {Params} from "@angular/router";
import {NormalizeHelper} from "./normalize-helper";
import {Sorting} from "./models/sorting.enum";

export class QueryParams {

    constructor(public sorting: Sorting,
                public year: number | null,
                public decade: number | null,
                public search: string | null,
                public rating: number | null,
                public isStrict: boolean,
                public isReviewsOnly: boolean,
                public category: string | null) {
    }

}

const VALID_CATEGORIES = ["movies", "shows", "all"];
export const DEFAULT_PARAMS = new QueryParams(Sorting.RATING, null, null, null, null, false, false, null);
export const DEFAULT_PARAMS_WITH_CATEGORY = new QueryParams(Sorting.RATING, null, null, null, null, false, false, "all");

/**
 * Helper for query parameter formatting
 */
export module QueryParamHelper {

    /**
     * Coverts raw params to {@link QueryParams}
     * @param params input params
     */
    export function aggregateParams(params: Params): QueryParams {
        return new QueryParams(
            getSortingFromParams(params),
            getYearFromParams(params),
            getDecadeFromParams(params),
            getSearchFromParams(params),
            getRatingFromParams(params),
            getBooleanValueFromParams(params, 'type', 'strict'),
            getBooleanValueFromParams(params, 'reviews', 'only'),
            getCategoryFromParams(params)
        );
    }

    /**
     * Generates params from form values
     * @param formGroup input form
     * @param resetComponent defines which components is marked for reset, can be null for no reset
     */
    export function getQueryParamsFromForm(formGroup: FormGroup, resetComponent: string | null): Params {
        const queryParams : Params = {};
        updateSearch(formGroup, queryParams);
        updateSorting(formGroup, queryParams);
        updateYearAndDecade(formGroup, queryParams);
        updateRating(formGroup, queryParams);
        updateRating(formGroup, queryParams);
        updateCategory(formGroup, queryParams)
        if (resetComponent !== null) {
            queryParams[resetComponent] = undefined;
        }
        return queryParams;
    }


    function getRatingFromParams(params: Params): number | null {
        const rating = params['r'];
        return !!rating && rating >= 0 && rating <= 10 ? parseInt(rating) : null;
    }

    function getBooleanValueFromParams(params: Params, queryKey: string, expectedValue: string): boolean {
        return params[queryKey] !== undefined && params[queryKey] !== null ?
            params[queryKey] === expectedValue :
            false;
    }

    function getSearchFromParams(params: Params): string | null {
        const search = params['q'];
        return !!search ? NormalizeHelper.fromQueryStringToNormal(search) : null;
    }

    function getCategoryFromParams(params: Params): string | null {
        const category = params['c'];
        if (!category) {
            return null;
        }
        return VALID_CATEGORIES.includes(category.toLowerCase()) ? category : null;
    }

    function getDecadeFromParams(params: Params): number | null {
        const decade = params['d'];
        return !!decade && decade % 10 === 0 ? parseInt(decade) : null;
    }

    function getYearFromParams(params: Params): number | null {
        const decade = params['d'];
        const year = params['y'];
        return !!year && !!decade ? parseInt(year) : null;
    }

    function getSortingFromParams(params: Params): Sorting {
        const sorting = params['s'];
        return !!sorting && Object.values(Sorting).includes(sorting) ? <Sorting>sorting : Sorting.RATING;
    }

    function updateYearAndDecade(formGroup: FormGroup, queryParams: Params) {
        const qDecadeStr = <number><unknown>formGroup.get('decade')?.value;
        const qYear = formGroup.get('year')?.value;
        if (qYear !== null && qYear !== undefined && qDecadeStr !== undefined && qDecadeStr !== null) {
            const qDecade = parseInt(String(qDecadeStr));
            if (qYear >= <number><unknown>qDecade && qYear < (<number><unknown>qDecade + 10)) {
                queryParams['y'] = parseInt(String(qYear));
            } else {
                queryParams['y'] = null;
            }
        } else {
            queryParams['y'] = null;
        }
        if (qDecadeStr !== null) {
            queryParams['d'] = parseInt(String(qDecadeStr));
        } else {
            queryParams['d'] = undefined;
        }
    }

    function updateSorting(formGroup: FormGroup, queryParams: Params) {
        const qSorting = formGroup.get('sorting')?.value;
        if (qSorting !== undefined && qSorting !== null) {
            queryParams['s'] = qSorting.toLowerCase();
        } else {
            queryParams['s'] = undefined;
        }
    }

    function updateSearch(formGroup: FormGroup, queryParams: Params) {
        let qSearch: string | null | undefined = formGroup.get("search")?.value;
        if (qSearch !== undefined && qSearch !== null && qSearch !== "") {
            queryParams['q'] = NormalizeHelper.fromNormalToQueryString(qSearch);
        } else {
            queryParams['q'] = undefined;
        }
    }

    function updateRating(formGroup: FormGroup, queryParams: Params) {
        const qRating = formGroup.get('rating')?.value;
        if (qRating !== null) {
            queryParams['r'] = qRating;
        } else {
            queryParams['r'] = undefined;
        }
    }

    function updateCategory(formGroup: FormGroup, queryParams: Params) {
        const qCategory = formGroup.get('category')?.value;
        if (qCategory !== null) {
            queryParams['c'] = qCategory;
        } else {
            queryParams['c'] = undefined;
        }
    }

}