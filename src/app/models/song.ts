import {Artist} from "./artist";

export class Song {

  constructor(public artist : Artist,
              public title : string,
              public url : string,
              public imgUrl : string,
              public previewUrl : string,
              public rating : number) {
  }

}
