import {SearchCategory} from "../../common/utils/search-category.enum";
import {Sorting} from "../../common/utils/sorting.enum";

export interface AotyRequest {
    year?: number;
    decade?: number;
    search?: string;
    rating?: number[];
    artist?: string;
    title?: string;
    isStrict?: boolean;
    isReviewsOnly?: boolean;
    searchCategory?: SearchCategory;
    sorting?: Sorting;
}