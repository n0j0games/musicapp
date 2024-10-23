export class Movie {

    constructor(public title : string,
                public creator : string,
                public years : number[],
                public rating : number | number[],
                public url : string,
                public imgUrl : string,
                public seasons? : number,
                public franchise? : string,) {}

}