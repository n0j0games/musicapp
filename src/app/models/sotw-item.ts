import {Song} from "./song";

export class SotwItem {

  constructor(public year : number,
              public week : number,
              public id : string,
              public songs : Song[]) {
  }

}
