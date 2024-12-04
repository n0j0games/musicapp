import {Artist} from "./artist";

export class Album {

    constructor(public artist : string,
                public url : string,
                public imgUrl : string,
                public previewUrl : string,
                public rating : number,
                public title : string,
                public songs? : { "title" : string, "preview_url" : string }[],
                public genre? : string,
                public onVinyl? : boolean,
                public playTime? : number,
                public playTime30Days? : number,
                public color? : string,
                public year? : number) {
    }

}
