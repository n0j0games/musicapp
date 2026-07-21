import {Album} from "./album";
import {Artist} from "./artist";

export interface AotyResponse {
    albums: Album[];
    artist?: Artist;
}