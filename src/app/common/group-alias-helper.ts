import {AliasList} from "./models/alias-list";
import {NormalizeHelper} from "./normalize-helper";
import {Album} from "./models/album";

export class GroupAliasHelper {

    public static artistFilter(qArtist: string, isStrict: boolean, allowIncompleteAnswers: boolean, album: Album, aliasList: AliasList) {
        const normAlbumArtist = NormalizeHelper.fromNormalToQueryString(album.artist);
        if (isStrict) {
            return qArtist === normAlbumArtist;
        } else {
            if (qArtist === normAlbumArtist) {
                return true;
            }
            if (GroupAliasHelper.includedInAliases(album.artist, qArtist, aliasList)) {
                return true;
            }
            const artistList = album.artist.split(',\n').map(x => NormalizeHelper.fromNormalToQueryString(x));
            if (allowIncompleteAnswers) {
                for (const artist_ of artistList) {
                    if (artist_.startsWith(qArtist) || qArtist.startsWith(artist_)) {
                        console.log(artist_, "matches", qArtist)
                        return true;
                    }
                }
            }
            return artistList.includes(qArtist);
        }
    }

    private static includedInAliases(artist: string, qArtist: string, aliasList: AliasList): boolean {
        const aliases = this.getGroupAliases(artist.toLowerCase(), aliasList);
        for (const alias of aliases) {
            if (qArtist.includes(alias)) {
                return true;
            }
        }
        return false;
    }

    private static getGroupAliases(artist: string, aliasList: AliasList) {
        const results: string[] = [];
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
