import {AliasList} from "./models/alias-list";
import {NormalizeHelper} from "./normalize-helper";

export class GroupAliasHelper {

    public static includedInAliases(artist : string, qArtist: string, aliasList: AliasList) : boolean {
        const aliases = this.getGroupAliases(artist.toLowerCase(), aliasList);
        for (const alias of aliases) {
            if (qArtist.includes(alias)) {
                return true;
            }
        }
        return false;
    }

    private static getGroupAliases(artist : string, aliasList : AliasList) {
        const results : string[] = [];
        for (let item of aliasList.groups) {
            if (item.group === artist) {
                return item.members.map(x => NormalizeHelper.fromNormalToQueryString(x));
            }
            if (item.members.includes(artist)) {
                results.push(NormalizeHelper.fromNormalToQueryString(item.group));
            }
        }
        return results;
    }

}
