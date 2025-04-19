export class NormalizeHelper {

    /**
     * Converts query string back to normal string by replacing "-" with white spaces
     * @param queryString input string
     */
    public static fromQueryStringToNormal(queryString: string): string {
        return NormalizeHelper.normalize(queryString.replaceAll("-", " "));
    }

    /**
     * Converts string to query compatible string by replacing white spaces with "-"
     * @param normalString input string
     */
    public static fromNormalToQueryString(normalString: string): string {
        return NormalizeHelper.normalize(normalString.replaceAll(" ", "-").replaceAll("%20", "-").replaceAll("+", "%0A").replaceAll("%0A", "-").replaceAll("\n", "-"));
    }

    /**
     * Normalizes and lower cases string by removing line breaks
     * @param queryString input string
     */
    public static normalize(queryString: string): string {
        return queryString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

}