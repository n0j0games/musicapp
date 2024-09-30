import {Artist} from "./artist";

export class Album {

    constructor(public artist : Artist,
                public url : string,
                public imgUrl : string,
                public previewUrl : string,
                public rating : number,
                public title : string,
                public songs? : string[]) {
    }

}
