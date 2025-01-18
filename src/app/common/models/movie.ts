export class Movie {

    constructor(public title : string,
                public creator : string,
                public year : number,
                public rating : number | number[],
                public url : string,
                public imgSrc : string,
                public seasons? : number,
                public franchise? : string,
                public activeSeason? : number) {}

}