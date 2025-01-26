export class Movie {

    constructor(public title : string,
                public year : number,
                public rating : number | number[],
                public url : string,
                public imgSrc : string,
                public creator? : string,
                public subtitle? : string
    ) {}

}