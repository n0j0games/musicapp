import {QueryParams} from "./query-param-helper";

export class AggregateTitleHelper {

    public static updateSubTitle(queryParams: QueryParams) {

        let sortingTitle = "";
        if (queryParams.year !== null) {
            sortingTitle = "from " + queryParams.year;
        }
        if (queryParams.year === null && queryParams.decade !== null) {
            sortingTitle = "from the " + queryParams.decade + "s";
        }
        if (queryParams.rating !== null) {
            sortingTitle = sortingTitle + " rated " + queryParams.rating;
        }
        if (queryParams.sorting !== null) {
            sortingTitle = sortingTitle + " sorted by " + queryParams.sorting;
        }
        return sortingTitle;
    }

}