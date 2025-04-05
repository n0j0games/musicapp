export class NormalizeHelper {

    public static fromQueryStringToNormal(queryString: string): string {
        return NormalizeHelper.normalize(queryString.replaceAll("-", " "));
    }

    public static fromNormalToQueryString(normalString: string): string {
        return NormalizeHelper.normalize(normalString.replaceAll(" ", "-").replaceAll("%20", "-").replaceAll("+", "%0A").replaceAll("%0A", "-").replaceAll("\n", "-"));
    }

    public static normalize(queryString: string): string {
        return queryString.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

}