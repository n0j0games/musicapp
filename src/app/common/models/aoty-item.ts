import {Album} from "./album";

export class AotyItem {

    constructor(public year : number,
                public albums : Album[],
                public isDecade? : boolean) {
    }

}
