import {Artist} from "./artist";

export class Song {

  constructor(public artist : Artist,
              public title : string,
              public url : string,
              public rating : number) {
  }

}
