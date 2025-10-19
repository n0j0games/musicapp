import {FormGroup} from "@angular/forms";
import {Params} from "@angular/router";
import {NormalizeHelper} from "./normalize-helper";
import {Sorting} from "./sorting.enum";
import {SearchCategory} from "./search-category.enum";

export class QueryParams {

    constructor(public sorting: Sorting,
                public year: number | null,
                public decade: number | null,
                public search: string | null,
                public rating: number | null,
                public isStrict: boolean,
                public isReviewsOnly: boolean,
                public category: string | null,
                public searchCategory: SearchCategory) {
    }

}

/**
 * Helper for query parameter formatting
 */
export class QueryParamHelper {

    public static DEFAULT_PARAMS = new QueryParams(Sorting.RATING, null, null, null, null, false, false, null, SearchCategory.ALL);
    public static DEFAULT_PARAMS_WITH_CATEGORY = new QueryParams(Sorting.RATING, null, null, null, null, false, false, "all", SearchCategory.ALL);
    private static VALID_CATEGORIES = ["movies", "shows", "all"];

    /**
     * Coverts raw params to {@link QueryParams}
     * @param params input params
     */
    public static aggregateParams(params: Params): QueryParams {
        return new QueryParams(
            this.getSortingFromParams(params),
            this.getYearFromParams(params),
            this.getDecadeFromParams(params),
            this.getSearchFromParams(params),
            this.getRatingFromParams(params),
            this.getBooleanValueFromParams(params, 'type', 'strict'),
            this.getBooleanValueFromParams(params, 'reviews', 'only'),
            this.getCategoryFromParams(params),
            this.getSearchCategoryFromParams(params)
        );
    }

    /**
     * Generates params from form values
     * @param formGroup input form
     * @param resetComponent defines which components is marked for reset, can be null for no reset
     */
    public static getQueryParamsFromForm(formGroup: FormGroup, resetComponent: string | null): Params {
        const queryParams : Params = {};
        this.updateSearch(formGroup, queryParams);
        this.updateSorting(formGroup, queryParams);
        this.updateYearAndDecade(formGroup, queryParams);
        this.updateRating(formGroup, queryParams);
        this.updateRating(formGroup, queryParams);
        this.updateCategory(formGroup, queryParams)
        this.updateSearchCategory(formGroup, queryParams);
        if (resetComponent !== null) {
            queryParams[resetComponent] = undefined;
        }
        return queryParams;
    }


    private static getRatingFromParams(params: Params): number | null {
        const rating = params['r'];
        return !!rating && rating >= 0 && rating <= 10 ? parseInt(rating) : null;
    }

    private static getBooleanValueFromParams(params: Params, queryKey: string, expectedValue: string): boolean {
        return params[queryKey] !== undefined && params[queryKey] !== null ?
            params[queryKey] === expectedValue :
            false;
    }

    private static getSearchFromParams(params: Params): string | null {
        const search = params['q'];
        return !!search ? NormalizeHelper.fromQueryStringToNormal(search) : null;
    }

    private static getCategoryFromParams(params: Params): string | null {
        const category = params['c'];
        if (!category) {
            return null;
        }
        return this.VALID_CATEGORIES.includes(category.toLowerCase()) ? category : null;
    }

    private static getDecadeFromParams(params: Params): number | null {
        const decade = params['d'];
        return !!decade && decade % 10 === 0 ? parseInt(decade) : null;
    }

    private static getYearFromParams(params: Params): number | null {
        const decade = params['d'];
        const year = params['y'];
        return !!year && !!decade ? parseInt(year) : null;
    }

    private static getSortingFromParams(params: Params): Sorting {
        const sorting = params['s'];
        return !!sorting && Object.values(Sorting).includes(sorting) ? <Sorting>sorting : Sorting.RATING;
    }

    private static getSearchCategoryFromParams(params: Params): SearchCategory {
        const searchCategory = params['sc'];
        return !!searchCategory && Object.values(SearchCategory).includes(searchCategory) ? <SearchCategory>searchCategory : SearchCategory.ALL;
    }

    private static updateYearAndDecade(formGroup: FormGroup, queryParams: Params) {
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

    private static updateSorting(formGroup: FormGroup, queryParams: Params) {
        const qSorting = formGroup.get('sorting')?.value;
        if (qSorting !== undefined && qSorting !== null) {
            queryParams['s'] = qSorting.toLowerCase();
        } else {
            queryParams['s'] = undefined;
        }
    }

    private static updateSearchCategory(formGroup: FormGroup, queryParams: Params) {
        const qSearchCategory = formGroup.get('searchCategory')?.value;
        if (qSearchCategory !== null && qSearchCategory !== undefined) {
            queryParams['sc'] = qSearchCategory.toLowerCase();
        } else {
            queryParams['sc'] = undefined;
        }
    }

    private static updateSearch(formGroup: FormGroup, queryParams: Params) {
        let qSearch: string | null | undefined = formGroup.get("search")?.value;
        if (qSearch !== undefined && qSearch !== null && qSearch !== "") {
            queryParams['q'] = NormalizeHelper.fromNormalToQueryString(qSearch);
        } else {
            queryParams['q'] = undefined;
        }
    }

    private static updateRating(formGroup: FormGroup, queryParams: Params) {
        const qRating = formGroup.get('rating')?.value;
        if (qRating !== null) {
            queryParams['r'] = qRating;
        } else {
            queryParams['r'] = undefined;
        }
    }

    private static updateCategory(formGroup: FormGroup, queryParams: Params) {
        const qCategory = formGroup.get('category')?.value;
        if (qCategory !== null) {
            queryParams['c'] = qCategory;
        } else {
            queryParams['c'] = undefined;
        }
    }

}